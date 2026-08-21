const prisma = require('../utils/db');

/**
 * Get all clients for the authenticated user
 * GET /api/clients
 */
const getClients = async (req, res) => {
  try {
    const userId = req.user.id;

    const clients = await prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        },
        _count: {
          select: { projects: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: clients,
      count: clients.length,
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch clients',
    });
  }
};

/**
 * Get a single client by ID
 * GET /api/clients/:id
 */
const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const client = await prisma.client.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        projects: true,
      },
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error('Get client by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch client',
    });
  }
};

/**
 * Create a new client
 * POST /api/clients
 */
const createClient = async (req, res) => {
  try {
    const { email, name, phone, address } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    // Check if client with this email already exists for this user
    const existingClient = email
      ? await prisma.client.findUnique({ where: { userId_email: { userId, email } } })
      : null;

    if (existingClient) {
      return res.status(409).json({
        success: false,
        message: 'A client with this email already exists',
      });
    }

    const client = await prisma.client.create({
      data: {
        email,
        name,
        phone,
        address,
        userId,
      },
      include: {
        projects: true,
        _count: {
          select: { projects: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client,
    });
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create client',
    });
  }
};

/**
 * Update a client
 * PUT /api/clients/:id
 */
const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, phone, address } = req.body;
    const userId = req.user.id;

    // Check if client exists and belongs to user
    const existingClient = await prisma.client.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingClient) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== existingClient.email) {
      const emailTaken = await prisma.client.findFirst({
        where: {
          email,
          userId,
          NOT: { id },
        },
      });

      if (emailTaken) {
        return res.status(409).json({
          success: false,
          message: 'A client with this email already exists',
        });
      }
    }

    const client = await prisma.client.update({
      where: { id },
      data: {
        email: email || existingClient.email,
        name: name || existingClient.name,
        phone: phone !== undefined ? phone : existingClient.phone,
        address: address !== undefined ? address : existingClient.address,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: client,
    });
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update client',
    });
  }
};

/**
 * Delete a client
 * DELETE /api/clients/:id
 */
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if client exists and belongs to user
    const existingClient = await prisma.client.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        projects: {
          select: { id: true },
        },
      },
    });

    if (!existingClient) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    // Check if client has projects
    if (existingClient.projects.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete client with existing projects. Delete or reassign projects first.',
        projectsCount: existingClient.projects.length,
      });
    }

    await prisma.client.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete client',
    });
  }
};

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};