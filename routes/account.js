const express = require('express');

const auth = require("../middleware/auth");

const accountController = require('../controllers/account');



const router = express.Router();


router.delete('/:accountId', auth, accountController.deleteAccount);


module.exports = router;