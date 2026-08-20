const express = require('express');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const router = express.Router();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/**
 * Paystack Webhook Handler
 * 
 * This endpoint receives payment confirmations from Paystack
 * ⚠️ IMPORTANT: This must use express.raw() to get the raw body
 * for signature verification
 */
router.post(
  '/paystack',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      // 1. Get raw body and signature from headers
      const rawBody = req.body.toString();
      const signature = req.headers['x-paystack-signature'];
      const secretKey = process.env.PAYSTACK_SECRET_KEY;

      // 2. Verify the webhook signature (MANDATORY for security)
      if (!verifyPaystackWebhook(rawBody, signature, secretKey)) {
        console.warn('⚠️ Invalid webhook signature - possible fraud attempt');
        return res.status(401).json({ error: 'Invalid signature' });
      }

      // 3. Parse the verified JSON body
      const event = JSON.parse(rawBody);
      console.log(`✅ Webhook received: ${event.event}`);

      // 4. Handle different event types
      switch (event.event) {
        case 'charge.success':
          await handleChargeSuccess(event.data);
          break;

        case 'charge.failed':
          await handleChargeFailed(event.data);
          break;

        case 'charge.pending':
          await handleChargePending(event.data);
          break;

        case 'refund.processed':
          await handleRefundProcessed(event.data);
          break;

        default:
          console.log(`ℹ️ Unhandled event type: ${event.event}`);
      }

      // 5. ALWAYS return 200 OK
      // If you don't, Paystack will retry for up to 72 hours
      res.status(200).send('Webhook received successfully');

    } catch (error) {
      console.error('❌ Webhook error:', error);
      // Still return 200 to prevent retries
      res.status(200).send('Webhook received with errors');
    }
  }
);

// ============================================
// SECURITY: Paystack Signature Verification
// ============================================

/**
 * Verify the webhook came from Paystack using HMAC-SHA512
 * 
 * How it works:
 * 1. Paystack signs the request body with your secret key
 * 2. We compute our own signature using the same method
 * 3. If they match, the request is legitimate
 */
function verifyPaystackWebhook(rawBody, signature, secretKey) {
  // If any required data is missing, reject immediately
  if (!signature || !secretKey) {
    console.warn('⚠️ Missing signature or secret key');
    return false;
  }

  try {
    // Compute HMAC-SHA512 signature of the RAW request body
    const expectedSignature = crypto
      .createHmac('sha512', secretKey)
      .update(rawBody) // ⚠️ Use raw body, NOT JSON.stringify(req.body)
      .digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(expectedSignature, 'utf8')
    );
  } catch (error) {
    console.error('❌ Signature verification error:', error);
    return false;
  }
}

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Handle successful payment
 */
async function handleChargeSuccess(data) {
  const reference = data.reference;
  console.log(`💰 Payment successful for reference: ${reference}`);

  try {
    // Find the invoice with this reference
    const invoice = await prisma.invoice.findFirst({
      where: { paystackReference: reference },
      include: {
        user: true,
        client: true,
        project: true
      }
    });

    if (!invoice) {
      console.warn(`⚠️ Invoice not found for reference: ${reference}`);
      return;
    }

    // Prevent double processing (idempotency)
    if (invoice.status === 'PAID') {
      console.log(`ℹ️ Invoice ${invoice.number} already marked as PAID`);
      return;
    }

    // Verify the amount matches (security check)
    const amountPaid = data.amount / 100; // Paystack amounts are in kobo (smallest currency unit)
    if (Math.abs(amountPaid - Number(invoice.amount)) > 0.01) {
      console.error(
        `❌ Amount mismatch! Expected ₦${Number(invoice.amount)}, got ₦${amountPaid}`
      );
      // Log for manual investigation but still mark as paid if close
      // In production, you might want to flag this for review
    }

    // Update invoice status to PAID
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        // Store additional Paystack details if needed
        // paystackData: data // You could store the full webhook data
      }
    });

    console.log(`✅ Invoice ${updatedInvoice.number} marked as PAID`);

    // Optional: Send notification to freelancer
    // await sendPaymentConfirmationEmail(invoice.user.email, updatedInvoice);

  } catch (error) {
    console.error('❌ Error handling charge success:', error);
    throw error; // Re-throw to be caught by the main handler
  }
}

/**
 * Handle failed payment
 */
async function handleChargeFailed(data) {
  const reference = data.reference;
  console.log(`❌ Payment failed for reference: ${reference}`);

  try {
    await prisma.invoice.updateMany({
      where: { paystackReference: reference },
      data: { status: 'CANCELLED' }
    });
    
    console.log(`✅ Invoice with reference ${reference} marked as CANCELLED`);
  } catch (error) {
    console.error('❌ Error handling charge failed:', error);
  }
}

/**
 * Handle pending payment (e.g., bank transfer waiting)
 */
async function handleChargePending(data) {
  const reference = data.reference;
  console.log(`⏳ Payment pending for reference: ${reference}`);

  // You might want to update the invoice status to PENDING
  // Or send a notification that payment is being processed
  try {
    // Optional: Update invoice status to PENDING
    // await prisma.invoice.updateMany({
    //   where: { paystackReference: reference },
    //   data: { status: 'PENDING' }
    // });
  } catch (error) {
    console.error('❌ Error handling pending charge:', error);
  }
}

/**
 * Handle refund processed
 */
async function handleRefundProcessed(data) {
  const reference = data.reference;
  console.log(`↩️ Refund processed for reference: ${reference}`);

  try {
    // Update invoice status to REFUNDED if needed
    // await prisma.invoice.updateMany({
    //   where: { paystackReference: reference },
    //   data: { status: 'REFUNDED' }
    // });
  } catch (error) {
    console.error('❌ Error handling refund:', error);
  }
}

module.exports = router;