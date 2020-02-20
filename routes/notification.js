const express = require('express');

const { body , query} = require('express-validator');

const notificationController = require('../controllers/notification-controller');

const router = express.Router();

router.get('/',  notificationController.getSubscriptions);
router.post('/',  notificationController.subscribe);
router.delete('/',
     [
        query('notificationEndpoint')
        .exists()
        .withMessage("Please enter the notificationEndpoint to delete as url query param")
   
    ], notificationController.unsubscribe);

router.post('/send',  
            [
                body('title').exists().withMessage("Please enter a title"), 
                body('message').exists().withMessage("Please enter a message")
            ], notificationController.send);
module.exports = router;
