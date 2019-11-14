const express = require('express');

const { body} = require('express-validator');

const auth  = require('../middleware/auth');

const projectController = require('../controllers/project');

const router = express.Router();

//Projects
router.get('/', auth, projectController.getProjects);
router.post('/', auth, [
    body('title').exists(),
    body('type').exists()
],
 projectController.postProject);
router.get('/:projectId', auth, projectController.getProject);
router.put('/:projectId', auth, projectController.updateProject);
router.delete('/:projectId', auth, projectController.deleteProject);

//Categories
router.get('/:projectId/categories', auth, projectController.getProjectCategories);
router.post('/:projectId/categories',auth, projectController.createProjectCategory);
router.get('/:projectId/categories/:categId',auth, projectController.getProjectCategory);
router.delete('/:projectId/categories/:categId',auth, projectController.deleteProjectCategory);
router.put('/:projectId/categories/:categId',auth, projectController.updateProjectCategory);

//Category Items
router.get('/:projectId/categories/:categId/items',auth, projectController.getProjectCategoryItems);
router.post('/:projectId/categories/:categId/items',auth, projectController.createProjectCategoryItem);
router.get('/:projectId/categories/:categId/items/:itemId',auth, projectController.getProjectCategoryItem);
router.delete('/:projectId/categories/:categId/items/:itemId',auth, projectController.deleteProjectCategoryItem);
router.put('/:projectId/categories/:categId/items/:itemId',auth, projectController.updateProjectCategoryItem);

//Project Items
router.get('/:projectId/items',auth, projectController.getProjectItems);
router.post('/:projectId/items', auth,projectController.createProjectItem);
router.get('/:projectId/items/:itemId', auth,projectController.getProjectItem);
router.delete('/:projectId/items/:itemId',auth, projectController.deleteProjectItem);
router.put('/:projectId/items/:itemId', auth,projectController.updateProjectItem);

module.exports = router;