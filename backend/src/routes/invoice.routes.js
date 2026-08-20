const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
} = require('../controllers/invoice.controller');
// Add this function
const handlePaystackWebhook = async (data) => {
  const { reference, amount, status } = data;
  
  const invoice = await prisma.invoice.findFirst({
    where: { paystackReference: reference }
  });

  if (!invoice) {
    console.log(`Invoice not found for reference: ${reference}`);
    return;
  }

  if (status === 'success') {
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { 
        status: 'PAID',
        paidAt: new Date()
      }
    });
    console.log(`✅ Invoice ${invoice.number} marked as PAID`);
  }
};

// All routes are protected (require authentication)
router.use(protect);

// Routes
router.get('/', getInvoices);
router.get('/:id', getInvoiceById);
router.post('/', createInvoice);
router.put('/:id', updateInvoice);
router.patch('/:id/status', updateInvoiceStatus);
router.delete('/:id', deleteInvoice);

module.exports = router;