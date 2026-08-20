const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/**
 * Get all projects for the authenticated user
 * GET /api/projects
 */
const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        invoices: {
          select: {
            id: true,
            number: true,
            amount: true,
            status: true,
          }
        },
        _count: {
          select: { invoices: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: projects,
      count: projects.length,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
    });
  }
};

/**
 * Get a single project by ID
 * GET /api/projects/:id
 */
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        client: true,
        invoices: true,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
    });
  }
};

/**
 * Get projects by client ID
 * GET /api/projects/client/:clientId
 */
const getProjectsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const userId = req.user.id;

    // Verify client belongs to user
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId,
      },
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    const projects = await prisma.project.findMany({
      where: {
        clientId,
        userId,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: projects,
      count: projects.length,
    });
  } catch (error) {
    console.error('Get projects by client error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
    });
  }
};

/**
 * Create a new project
 * POST /api/projects
 */
const createProject = async (req, res) => {
  try {
    const { name, description, status, rate, clientId } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!name || !clientId) {
      return res.status(400).json({
        success: false,
        message: 'Project name and client ID are required',
      });
    }

    // Verify client exists and belongs to user
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId,
      },
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        status: status || 'ACTIVE',
        rate: rate ? parseFloat(rate) : null,
        clientId,
        userId,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
    });
  }
};

/**
 * Update a project
 * PUT /api/projects/:id
 */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, rate, clientId } = req.body;
    const userId = req.user.id;

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // If clientId is being changed, verify the new client
    if (clientId && clientId !== existingProject.clientId) {
      const client = await prisma.client.findFirst({
        where: {
          id: clientId,
          userId,
        },
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client not found',
        });
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        name: name || existingProject.name,
        description: description !== undefined ? description : existingProject.description,
        status: status || existingProject.status,
        rate: rate !== undefined ? (rate ? parseFloat(rate) : null) : existingProject.rate,
        clientId: clientId || existingProject.clientId,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
    });
  }
};

/**
 * Delete a project
 * DELETE /api/projects/:id
 */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        invoices: {
          select: { id: true },
        },
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if project has invoices
    if (existingProject.invoices.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete project with existing invoices. Delete or reassign invoices first.',
        invoicesCount: existingProject.invoices.length,
      });
    }

    await prisma.project.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
    });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  getProjectsByClient,
  createProject,
  updateProject,
  deleteProject,
};