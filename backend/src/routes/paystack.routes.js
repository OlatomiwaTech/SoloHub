const crypto = require('crypto');
const express = require('express');
const { protect } = require('../middleware/auth');
const { initializeTransaction, verifyTransaction } = require('../utils/paystack');
const prisma = require('../utils/db');

const router = express.Router();
router.use(protect);

router.post('/initialize', async (req, res) => {
  try {
    const { invoiceId } = req.body;
    if (typeof invoiceId !== 'string' || !invoiceId) {
      return res.status(400).json({ success: false, message: 'Invoice ID is required' });
    }

    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, userId: req.user.id },
      include: { project: { include: { client: { select: { email: true } } } } },
    });

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    if (['PAID', 'CANCELLED'].includes(invoice.status)) {
      return res.status(400).json({ success: false, message: 'This invoice cannot be paid' });
    }

    const clientEmail = invoice.project?.client?.email;
    if (!clientEmail) {
      return res.status(400).json({ success: false, message: 'Add an email address to this invoice client before requesting payment' });
    }

    const reference = `SH-${crypto.randomUUID()}`;
    const result = await initializeTransaction(
      clientEmail,
      invoice.amount,
      reference,
      { invoiceId: invoice.id, invoiceNumber: invoice.number, userId: req.user.id }
    );

    if (!result.success) {
      return res.status(502).json({ success: false, message: result.message });
    }

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { paystackReference: reference },
    });

    return res.json({
      success: true,
      data: { authorizationUrl: result.authorizationUrl, reference },
    });
  } catch (error) {
    console.error('Initialize payment error:', error);
    return res.status(500).json({ success: false, message: 'Failed to initialize payment' });
  }
});

router.get('/verify/:reference', async (req, res) => {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: { paystackReference: req.params.reference, userId: req.user.id },
    });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Payment reference not found' });
    }

    const result = await verifyTransaction(req.params.reference);
    if (!result.success) {
      return res.status(502).json({ success: false, message: result.message });
    }

    const payment = result.data;
    const expectedAmount = Math.round(Number(invoice.amount) * 100);
    if (payment.reference !== invoice.paystackReference) {
      return res.status(400).json({ success: false, message: 'Payment reference does not match' });
    }

    const paid = payment.status === 'success'
      && payment.currency === 'NGN'
      && Number(payment.amount) === expectedAmount;

    if (paid && invoice.status !== 'PAID') {
      await prisma.invoice.updateMany({
        where: {
          id: invoice.id,
          userId: req.user.id,
          paystackReference: payment.reference,
          status: { not: 'PAID' },
        },
        data: { status: 'PAID', paidAt: new Date() },
      });
    }

    const updatedInvoice = await prisma.invoice.findFirst({
      where: { id: invoice.id, userId: req.user.id },
    });
    return res.json({
      success: true,
      data: { status: paid ? 'success' : payment.status, invoice: updatedInvoice },
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
});

module.exports = router;
