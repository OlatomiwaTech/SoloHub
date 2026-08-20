const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProjects,
  getProjectById,
  getProjectsByClient,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/project.controller');

// All routes are protected (require authentication)
router.use(protect);

// Routes
router.get('/', getProjects);
router.get('/client/:clientId', getProjectsByClient);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;