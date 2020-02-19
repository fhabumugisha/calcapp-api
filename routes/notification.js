const express = require('express');



const notificationController = require('../controllers/notification-controller');

const router = express.Router();

router.get('/',  notificationController.getSubscriptions);
router.post('/',  notificationController.subscribe);
router.delete('/:notificationEndPoint',  notificationController.unsubscribe);

router.post('/send',  notificationController.send);
module.exports = router;
