const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const invoiceInclude = {
  project: {
    select: {
      id: true,
      name: true,
      client: {
        select: { id: true, name: true, email: true },
      },
    },
  },
};

const getInvoices = async (req, res) => {
  try {
    const { status, clientId, projectId } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status;
    if (clientId) where.project = { clientId };
    if (projectId) where.projectId = projectId;

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: invoiceInclude,
    });
    const totals = invoices.reduce((summary, invoice) => {
      const amount = Number(invoice.amount);
      summary.total += amount;
      if (invoice.status === 'PAID') summary.paid += amount;
      if (invoice.status === 'SENT' || invoice.status === 'DRAFT') summary.pending += amount;
      if (invoice.status === 'OVERDUE') summary.overdue += amount;
      return summary;
    }, { total: 0, paid: 0, pending: 0, overdue: 0 });

    res.json({ success: true, data: invoices, count: invoices.length, totals });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch invoices' });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: invoiceInclude,
    });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch invoice' });
  }
};

const createInvoice = async (req, res) => {
  try {
    const { amount, description, dueDate, projectId, status = 'DRAFT', notes } = req.body;
    const userId = req.user.id;
    if (!amount || !projectId || !dueDate) {
      return res.status(400).json({ success: false, message: 'Amount, project ID, and due date are required' });
    }

    const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const latestInvoice = await prisma.invoice.findFirst({
      where: { number: { startsWith: 'INV-' } },
      orderBy: { number: 'desc' },
      select: { number: true },
    });
    const latestNumber = Number.parseInt(latestInvoice?.number?.replace('INV-', ''), 10) || 0;
    const number = `INV-${String(latestNumber + 1).padStart(6, '0')}`;

    const invoice = await prisma.invoice.create({
      data: {
        number,
        amount: amount.toFixed(2),
        description: description || '',
        dueDate: new Date(dueDate),
        status,
        notes: notes || '',
        projectId,
        userId,
      },
      include: invoiceInclude,
    });
    res.status(201).json({ success: true, message: 'Invoice created successfully', data: invoice });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ success: false, message: 'Failed to create invoice' });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const existingInvoice = await prisma.invoice.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existingInvoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    if (existingInvoice.status === 'PAID' && req.body.status !== 'PAID') {
      return res.status(400).json({ success: false, message: 'Cannot modify a paid invoice' });
    }

    const { amount, description, dueDate, status, notes } = req.body;
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: {
        amount: amount === undefined ? existingInvoice.amount : parseFloat(amount).toFixed(2),
        description: description === undefined ? existingInvoice.description : description,
        dueDate: dueDate ? new Date(dueDate) : existingInvoice.dueDate,
        status: status || existingInvoice.status,
        notes: notes === undefined ? existingInvoice.notes : notes,
      },
      include: invoiceInclude,
    });
    res.json({ success: true, message: 'Invoice updated successfully', data: invoice });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ success: false, message: 'Failed to update invoice' });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const invoice = await prisma.invoice.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    if (invoice.status === 'PAID') return res.status(400).json({ success: false, message: 'Cannot delete a paid invoice' });
    await prisma.invoice.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete invoice' });
  }
};

const updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });

    const existingInvoice = await prisma.invoice.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existingInvoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: { status, paidAt: status === 'PAID' ? new Date() : existingInvoice.paidAt },
      include: invoiceInclude,
    });
    res.json({ success: true, message: 'Invoice status updated successfully', data: invoice });
  } catch (error) {
    console.error('Update invoice status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update invoice status' });
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
};
