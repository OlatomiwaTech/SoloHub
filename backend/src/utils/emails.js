const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send invoice email to client
 */
const sendInvoiceEmail = async (invoiceId) => {
  try {
    // Get invoice with all relations
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        client: true,
        project: true,
        user: true,
      },
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #059669; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">SoloHub</h1>
          <p style="margin: 0;">Your Professional Invoice</p>
        </div>
        <div style="padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
          <p>Dear ${invoice.client.name},</p>
          <p>Please find your invoice <strong>#${invoice.number}</strong> below.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Invoice Summary</h3>
            <p><strong>Project:</strong> ${invoice.project.name}</p>
            <p><strong>Amount:</strong> ₦${invoice.amount.toLocaleString()}</p>
            <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
            ${invoice.description ? `<p><strong>Description:</strong> ${invoice.description}</p>` : ''}
          </div>
          
          <p style="margin-top: 20px;">You can view and pay this invoice online at:</p>
          <p style="text-align: center; margin: 25px 0;">
            <a href="${process.env.APP_URL}/invoices" 
               style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View & Pay Invoice
            </a>
          </p>
          
          <p style="margin-top: 30px; font-size: 14px; color: #64748b;">
            Thank you for your business!<br>
            <strong>- The SoloHub Team</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 15px; font-size: 12px; color: #94a3b8;">
          Made with ❤️ in Nigeria
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"SoloHub" <${process.env.EMAIL_FROM || 'noreply@solohub.app'}>`,
      to: invoice.client.email,
      subject: `Invoice #${invoice.number} from ${invoice.user.fullName}`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Invoice email sent to ${invoice.client.email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send payment confirmation email
 */
const sendPaymentConfirmationEmail = async (invoiceId) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        client: true,
        project: true,
        user: true,
      },
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #059669; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">💰 Payment Received!</h1>
        </div>
        <div style="padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
          <p>Dear ${invoice.user.fullName},</p>
          <p>We're happy to confirm that invoice <strong>#${invoice.number}</strong> has been paid.</p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bbf7d0;">
            <h3 style="margin-top: 0;">Payment Details</h3>
            <p><strong>Invoice:</strong> #${invoice.number}</p>
            <p><strong>Client:</strong> ${invoice.client.name}</p>
            <p><strong>Amount:</strong> ₦${invoice.amount.toLocaleString()}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p style="margin-top: 20px;">Thank you for using SoloHub!</p>
        </div>
        <div style="text-align: center; padding: 15px; font-size: 12px; color: #94a3b8;">
          Made with ❤️ in Nigeria
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"SoloHub" <${process.env.EMAIL_FROM || 'noreply@solohub.app'}>`,
      to: invoice.user.email,
      subject: `💰 Payment Received - Invoice #${invoice.number}`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Payment confirmation email sent to ${invoice.user.email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Payment confirmation email error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendInvoiceEmail,
  sendPaymentConfirmationEmail,
};