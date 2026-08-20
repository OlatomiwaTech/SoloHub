const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendInvoiceEmail = async (to, invoice, pdfBuffer) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #059669; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">SoloHub</h1>
        <p style="margin: 0;">Your Professional Invoice</p>
      </div>
      <div style="padding: 20px; border: 1px solid #e2e8f0;">
        <p>Dear ${invoice.client?.name},</p>
        <p>Please find your invoice <strong>#${invoice.number}</strong> attached.</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Amount Due:</strong> NGN ${Number(invoice.amount).toLocaleString()}</p>
          <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
          <p><strong>Project:</strong> ${invoice.project?.name}</p>
        </div>
        <p style="margin-top: 20px;">You can view and pay this invoice online at:</p>
        <p><a href="${process.env.APP_URL}/invoices/${invoice.id}" style="background: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View & Pay Invoice</a></p>
        <p style="margin-top: 30px; font-size: 14px; color: #64748b;">
          Thank you for your business!<br>
          - The SoloHub Team
        </p>
      </div>
      <div style="text-align: center; padding: 10px; font-size: 12px; color: #94a3b8;">
        Made with ❤️ in Nigeria
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"SoloHub" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `Invoice #${invoice.number} from SoloHub`,
    html,
    attachments: [
      {
        filename: `Invoice-${invoice.number}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendInvoiceEmail };