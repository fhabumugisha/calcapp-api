const express = require('express');

const { body} = require('express-validator');

const isAuth  = require('../middleware/auth');

const projectController = require('../controllers/project');

const router = express.Router();

router.get('/', projectController.getProjects);



module.exports = router;