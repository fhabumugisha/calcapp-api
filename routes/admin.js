const express = require('express');

const auth = require('../middleware/auth');

const adminController = require('../controllers/admin-controller');

const router = express.Router();




router.get('/users',  adminController.getUsers);

router.get('/projects',  adminController.getProjects);

router.get('/projects/:projectId',  adminController.getProject);

router.delete('/users/:userId', adminController.deleteUser);


module.exports = router;
