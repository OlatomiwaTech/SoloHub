const crypto = require('crypto');
const express = require('express');
const prisma = require('../utils/db');

const router = express.Router();

router.post('/paystack', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.get('x-paystack-signature');
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!Buffer.isBuffer(req.body) || !signature || !secretKey) {
    return res.status(401).json({ success: false, message: 'Invalid webhook signature' });
  }

  const expected = crypto.createHmac('sha512', secretKey).update(req.body).digest();
  let received;
  try {
    received = Buffer.from(signature, 'hex');
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid webhook signature' });
  }
  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) {
    return res.status(401).json({ success: false, message: 'Invalid webhook signature' });
  }

  let event;
  try {
    event = JSON.parse(req.body.toString('utf8'));
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid webhook payload' });
  }

  if (event.event !== 'charge.success') {
    return res.sendStatus(200);
  }

  const { reference, amount, currency, status } = event.data || {};
  if (!reference || status !== 'success') {
    return res.sendStatus(200);
  }

  try {
    const invoice = await prisma.invoice.findFirst({
      where: { paystackReference: reference },
      select: { id: true, amount: true, status: true },
    });
    if (!invoice) {
      console.warn(`Paystack webhook reference not found: ${reference}`);
      return res.sendStatus(200);
    }

    const expectedAmount = Math.round(Number(invoice.amount) * 100);
    if (currency !== 'NGN' || Number(amount) !== expectedAmount) {
      console.error(`Paystack amount/currency mismatch for invoice ${invoice.id}`);
      return res.status(400).json({ success: false, message: 'Payment amount or currency mismatch' });
    }

    if (invoice.status !== 'PAID') {
      await prisma.invoice.updateMany({
        where: { id: invoice.id, paystackReference: reference, status: { not: 'PAID' } },
        data: { status: 'PAID', paidAt: new Date() },
      });
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error('Paystack webhook processing failed:', error);
    return res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
});

module.exports = router;
