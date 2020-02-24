const express = require('express');

const { query} = require('express-validator');

const notificationController = require('../controllers/notification-controller');

const router = express.Router();


router.post('/',  notificationController.subscribe);
router.delete('/',
     [
        query('notificationEndpoint')
        .exists()
        .withMessage("Please enter the notificationEndpoint to delete as url query param")
   
    ], notificationController.unsubscribe);


module.exports = router;
