const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { initializeTransaction, verifyTransaction } = require('../utils/paystack');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Initialize payment for an invoice
 * POST /api/payments/initialize
 */
router.post('/initialize', protect, async (req, res) => {
  try {
    const { invoiceId } = req.body;
    const userId = req.user.id;

    // Find the invoice
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId,
      },
      include: {
        project: {
          include: {
            client: true,
          },
        },
        client: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    // Don't allow payment on already paid invoices
    if (invoice.status === 'PAID') {
      return res.status(400).json({
        success: false,
        message: 'Invoice already paid',
      });
    }

    const clientEmail = invoice.project?.client?.email || invoice.client?.email || req.user.email;
    const reference = `SOLO-${invoice.number}-${Date.now()}`;

    const result = await initializeTransaction(
      clientEmail,
      invoice.amount,
      reference,
      {
        custom_fields: [
          {
            display_name: 'Invoice Number',
            variable_name: 'invoice_number',
            value: invoice.number,
          },
          {
            display_name: 'Invoice ID',
            variable_name: 'invoice_id',
            value: invoice.id,
          },
        ],
      }
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || 'Payment initialization failed',
      });
    }

    // Store the reference in the invoice
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { paystackReference: reference },
    });

    res.status(200).json({
      success: true,
      data: {
        authorizationUrl: result.authorizationUrl,
        reference,
      },
    });
  } catch (error) {
    console.error('Initialize payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize payment',
    });
  }
});

/**
 * Verify payment
 * GET /api/payments/verify/:reference
 */
router.get('/verify/:reference', protect, async (req, res) => {
  try {
    const { reference } = req.params;

    const result = await verifyTransaction(reference);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || 'Payment verification failed',
      });
    }

    const paymentData = result.data;

    // Find the invoice with this reference
    const invoice = await prisma.invoice.findFirst({
      where: { paystackReference: reference },
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found for this transaction',
      });
    }

    // Update invoice status if payment was successful
    if (paymentData.status === 'success') {
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          status: 'PAID',
          paidAt: new Date(),
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        status: paymentData.status,
        amount: paymentData.amount / 100,
        invoice: invoice,
      },
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
    });
  }
});

module.exports = router;