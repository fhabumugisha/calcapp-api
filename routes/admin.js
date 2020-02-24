const express = require('express');
const { body} = require('express-validator');
const notificationController = require('../controllers/notification-controller');

const adminController = require('../controllers/admin-controller');

const router = express.Router();

const adminAuth = require('../middleware/admin-auth');




router.get('/projects', adminAuth, adminController.getProjects);

router.get('/projects/:projectId', adminAuth, adminController.getProject);

router.get('/users', adminAuth, adminController.getUsers);

router.delete('/users/:userId', adminAuth, adminController.deleteUser);

router.get('/notifications', adminAuth, notificationController.getNotifications);
router.post('/notifications/send-notification',  adminAuth,
            [
                body('title').not().isEmpty().withMessage("Please enter a title"), 
                body('message').not().isEmpty().withMessage("Please enter a message")
            ], notificationController.send);


module.exports = router;
