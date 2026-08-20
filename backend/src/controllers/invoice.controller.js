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
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
};

/**
 * Get all invoices for the authenticated user
 * GET /api/invoices
 */
const getInvoices = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, clientId, projectId, startDate, endDate } = req.query;

    // Build filter conditions
    const where = { userId };

    if (status) where.status = status;
    if (clientId) where.project = { clientId };
    if (projectId) where.projectId = projectId;
    if (startDate) where.issueDate = { ...where.issueDate, gte: new Date(startDate) };
    if (endDate) where.issueDate = { ...where.issueDate, lte: new Date(endDate) };

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: invoiceInclude
    });

    // Calculate totals
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidAmount = invoices
      .filter(inv => inv.status === 'PAID')
      .reduce((sum, inv) => sum + inv.amount, 0);
    const pendingAmount = invoices
      .filter(inv => inv.status === 'SENT' || inv.status === 'DRAFT')
      .reduce((sum, inv) => sum + inv.amount, 0);
    const overdueAmount = invoices
      .filter(inv => inv.status === 'OVERDUE')
      .reduce((sum, inv) => sum + inv.amount, 0);

    res.status(200).json({
      success: true,
      data: invoices,
      count: invoices.length,
      totals: {
        total: totalAmount,
        paid: paidAmount,
        pending: pendingAmount,
        overdue: overdueAmount,
      }
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices',
    });
  }
};

/**
 * Get a single invoice by ID
 * GET /api/invoices/:id
 */
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        userId,
      },
      include: invoiceInclude,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error('Get invoice by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice',
    });
  }
};

/**
 * Create a new invoice
 * POST /api/invoices
 */
const createInvoice = async (req, res) => {
  try {
    const { 
      amount, 
      description, 
      dueDate, 
      projectId, 
      status = 'DRAFT',
      notes 
    } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!amount || !projectId || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Amount, project ID, and due date are required',
      });
    }

    // Verify project exists and belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Invoice numbers are globally unique, so do not count only this user's invoices.
    const latestInvoice = await prisma.invoice.findFirst({
      where: { number: { startsWith: 'INV-' } },
      orderBy: { number: 'desc' },
      select: { number: true },
    });
    const latestNumber = Number.parseInt(latestInvoice?.number?.replace('INV-', ''), 10) || 0;
    const invoiceNumber = `INV-${String(latestNumber + 1).padStart(6, '0')}`;

    const invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber,
        amount: parseFloat(amount),
        description: description || '',
        dueDate: new Date(dueDate),
        status: status || 'DRAFT',
        notes: notes || '',
        projectId,
        userId,
      },
      include: invoiceInclude
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: invoice,
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create invoice',
    });
  }
};

/**
 * Update an invoice
 * PUT /api/invoices/:id
 */
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, dueDate, status, notes } = req.body;
    const userId = req.user.id;

    // Check if invoice exists and belongs to user
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingInvoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    // Prevent updating PAID invoices (can't change paid invoices)
    if (existingInvoice.status === 'PAID' && status !== 'PAID') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify a paid invoice',
      });
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        amount: amount !== undefined ? parseFloat(amount) : existingInvoice.amount,
        description: description !== undefined ? description : existingInvoice.description,
        dueDate: dueDate ? new Date(dueDate) : existingInvoice.dueDate,
        status: status || existingInvoice.status,
        notes: notes !== undefined ? notes : existingInvoice.notes,
      },
      include: invoiceInclude
    });

    res.status(200).json({
      success: true,
      message: 'Invoice updated successfully',
      data: invoice,
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update invoice',
    });
  }
};

/**
 * Delete an invoice
 * DELETE /api/invoices/:id
 */
const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if invoice exists and belongs to user
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingInvoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    // Don't allow deleting PAID invoices
    if (existingInvoice.status === 'PAID') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a paid invoice',
      });
    }

    await prisma.invoice.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete invoice',
    });
  }
};

/**
 * Update invoice status
 * PATCH /api/invoices/:id/status
 */
const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    const validStatuses = ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    // Check if invoice exists and belongs to user
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingInvoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    // If marking as PAID, set paidAt date
    const paidAt = status === 'PAID' ? new Date() : existingInvoice.paidAt;

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        status,
        paidAt,
      },
      include: invoiceInclude
    });

    res.status(200).json({
      success: true,
      message: 'Invoice status updated successfully',
      data: invoice,
    });
  } catch (error) {
    console.error('Update invoice status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update invoice status',
    });
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