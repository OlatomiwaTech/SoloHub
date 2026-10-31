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
  recordManualPayment,
} = require('../controllers/invoice.controller');

// All routes are protected (require authentication)
router.use(protect);

// Routes
router.get('/', getInvoices);
router.get('/:id', getInvoiceById);
router.post('/', createInvoice);
router.put('/:id', updateInvoice);
router.patch('/:id/status', updateInvoiceStatus);
router.patch('/:id/manual-payment', recordManualPayment);
router.delete('/:id', deleteInvoice);

module.exports = router;
