const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

//Signup
exports.signup = async (req, res, next) => {
    //handlerInputValidationResult(req);
    
    try {
        const errors = await validationResult(req);
        console.log('errors: ', errors);    
    if (!errors.isEmpty()) {
        console.log('errors: ', errors.errors);
        const extractedErrors = []
        errors.errors.map(err => extractedErrors.push(err.msg));
        console.log('extractedErrors :' , extractedErrors);
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = extractedErrors;

        throw error;
    }

    const email =  req.body.email;
    const password = req.body.password;
        const hashedPwd = await bcrypt.hash(password, 12);
    const user = new User({
        email: email,
        password: hashedPwd,
        projects: []
    });
    const savedUser =  await user.save();
    res.status (200).json({
        message : 'User created',
        userId: savedUser._id
    })
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
    
}

//Login
exports.login = async (req, res, next) => {
    handlerInputValidationResult(req);
    const email = req.body.email;
    const password = req.body.password;
    try {
        const loadedUser =  await User.findOne({email: email});
        if(!loadedUser){
            const error = new Error('Email or password invalid.');
            error.statusCode = 401;
            throw error;
        }
        const isPasswordEqual = await bcrypt.compare(password, loadedUser.password);
        if(!isPasswordEqual){
            const error = new Error('Email or password invalid.');
            error.statusCode = 401;
            throw error;
        }
        const expiredDuration = 7200;
        const token =  jwt.sign({
            email : loadedUser.email,
            userId: loadedUser._id.toString()
        },process.env.JWT_KEY, {
            expiresIn: expiredDuration
        });
    
        res.status(200).json({
            token : token,
            userId: loadedUser._id.toString(),
            expiresIn: expiredDuration,
            email : loadedUser.email
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
          }
          next(error);
    }
   
}

function handlerInputValidationResult(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        console.log(errors);
        
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
}
