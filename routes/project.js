const express = require('express');

const { body } = require('express-validator');

const auth = require('../middleware/auth');

const projectController = require("../controllers/project-controller");

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

// Categories
router.get(
  '/:projectId/categories',
  auth,
  projectController.getProjectCategories
);

router.post(
  '/:projectId/categories',
  auth,
  [body('title').not().isEmpty()],
  projectController.createProjectCategory
);

router.get(
  '/:projectId/categories/:categoryId',
  auth,
  projectController.getProjectCategory
);

router.delete(
  '/:projectId/categories/:categoryId',
  auth,
  projectController.deleteProjectCategory
);

router.put(
  '/:projectId/categories/:categoryId',
  auth,
  [body('title').not().isEmpty()],
  projectController.updateProjectCategory
);

// Category Items
router.get(
  '/:projectId/categories/:categoryId/items',
  auth,
  projectController.getProjectCategoryItems
);

router.post(
  '/:projectId/categories/:categoryId/items',
  auth,
  [body('title').not().isEmpty(), body('amount').isDecimal().withMessage('Should be a decimal number')],
  projectController.createProjectCategoryItem
);

router.get(
  '/:projectId/categories/:categoryId/items/:itemId',
  auth,
  projectController.getProjectCategoryItem
);

router.delete(
  '/:projectId/categories/:categoryId/items/:itemId',
  auth,
  projectController.deleteProjectCategoryItem
);

router.put(
  '/:projectId/categories/:categoryId/items/:itemId',
  auth,
  [body('title').not().isEmpty(), body('amount').isDecimal().withMessage('Should be a decimal number')],
  projectController.updateProjectCategoryItem
);

// Project Items
router.get('/:projectId/items', auth, projectController.getProjectItems);

router.post(
  '/:projectId/items',
  auth,
  [body('title').not().isEmpty(), body('amount').isDecimal().withMessage('Should be a decimal number')],
  projectController.createProjectItem
);

router.get('/:projectId/items/:itemId', auth, projectController.getProjectItem);

router.delete(
  '/:projectId/items/:itemId',
  auth,
  projectController.deleteProjectItem
);

router.put(
  '/:projectId/items/:itemId',
  auth,
  [body('title').not().isEmpty(), body('amount').isDecimal().withMessage('Should be a decimal number')],
  projectController.updateProjectItem
);

module.exports = router;
