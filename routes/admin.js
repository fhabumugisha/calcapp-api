const express = require('express');



const adminController = require('../controllers/admin-controller');

const router = express.Router();

const adminAuth = require('../middleware/admin-auth');


router.get('/users', adminAuth, adminController.getUsers);

router.get('/projects', adminAuth, adminController.getProjects);

router.get('/projects/:projectId', adminAuth, adminController.getProject);

router.delete('/users/:userId', adminAuth, adminController.deleteUser);


module.exports = router;
