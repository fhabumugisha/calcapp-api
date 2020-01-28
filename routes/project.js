const express = require('express');

const { body } = require('express-validator');

const auth = require('../middleware/auth');

const projectController = require('../controllers/project-controller');

const router = express.Router();

// Projects
router.get('/', auth, projectController.getProjects);

router.post(
  '/',
  auth,
  [body('title').exists(), body('type').exists()],
  projectController.postProject
);

router.get('/:projectId', auth, projectController.getProject);

router.put(
  '/:projectId',
  auth,
  [body('title').not().isEmpty()],
  projectController.updateProject
);

router.delete('/:projectId', auth, projectController.deleteProject);


module.exports = router;
