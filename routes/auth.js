const express = require('express');

const { body } = require('express-validator');

const authController = require('../controllers/auth-controller');
const userService = require("../services/user-service");

const router = express.Router();


router.post('/signup', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .bail()
    // eslint-disable-next-line consistent-return
    .custom((value) => userService.getUserByEmail(value).then((userDoc) => {
      if (userDoc) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject(' E-Mail exists already, please pick a different one.');
      }
    }))
    .normalizeEmail(),
  body('password',
    'Please enter a password with only numbers and text and at least 5 characters.')
    .trim()
    .isLength({ min: 5 })
    .isAlphanumeric(),
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match');
      }
      return true;
    })

],
authController.signup);

router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .bail()
    
    .normalizeEmail(),
  body('password',
    'Please enter a password with only numbers and text and at least 5 characters.')
    .trim()
    .isLength({ min: 5 })
    .isAlphanumeric()
],
authController.login);


module.exports = router;
