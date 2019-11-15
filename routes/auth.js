const express = require('express');

const { body } = require('express-validator');

const authController = require('../controllers/auth');

const User = require('../models/user');

const router = express.Router();


router.post('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, req) => {
                return User.findOne({email: value}).then(userDoc => {
                    if(userDoc){
                        return Promise.reject(' E-Mail exists already, please pick a different one.');
                    }
                })
        })
        .normalizeEmail(),
    body('password',
        'Please enter a password with only numbers and text and at least 5 characters.')
        .trim()
        .isLength({ min: 5 })
        .isAlphanumeric(),
    body('confirmPassword').trim()
        .custom((value, req) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match');
            }
            return true;
        })

],
authController.signup
);

router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, req) => {
            //TODO
        })
        .normalizeEmail(),
    body('password',
        'Please enter a password with only numbers and text and at least 5 characters.')
        .trim()
        .isLength({ min: 5 })
        .isAlphanumeric()
],
authController.login
);


module.exports = router;