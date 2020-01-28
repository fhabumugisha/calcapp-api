/* eslint-disable no-underscore-dangle */
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const debug = require('debug')('app:authController');
const chalk = require('chalk');
const User = require('../models/user');

const handlerInputValidationResult = async (req) => {
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    debug(chalk.red(errors.array()));
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
};


// Signup
exports.signup = async (req, res, next) => {
  // handlerInputValidationResult(req);

  try {
    const errors = await validationResult(req);
    debug('errors: ', errors);
    if (!errors.isEmpty()) {
      debug(chalk.red('errors: ', errors.errors));
      const extractedErrors = [];
      errors.errors.map((err) => extractedErrors.push(err.msg));
      debug('extractedErrors :', extractedErrors);
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = extractedErrors;

      throw error;
    }

    const { email } = req.body;
    const { password } = req.body;
    const hashedPwd = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPwd,
      projects: []
    });
    const savedUser = await user.save();
    res.status(200).json({
      message: 'User created',
      userId: savedUser._id
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
 
  const { email, password } = req.body;

  try {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      debug(chalk.red(errors.errors));
      const extractedErrors = [];
      errors.errors.map((err) => extractedErrors.push(err.msg));
      debug('extractedErrors :', extractedErrors);
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = extractedErrors;
      throw error;
    }
    const loadedUser = await User.findOne({ email });
    if (!loadedUser) {
      const error = new Error('Email or password invalid.');
      error.statusCode = 401;
      throw error;
    }
    const isPasswordEqual = await bcrypt.compare(password, loadedUser.password);
    if (!isPasswordEqual) {
      const error = new Error('Email or password invalid.');
      error.statusCode = 401;
      throw error;
    }
    const expiredDuration = 7200;
    const token = jwt.sign({
      email: loadedUser.email,
      userId: loadedUser._id.toString()
    }, process.env.JWT_KEY, {
      expiresIn: expiredDuration
    });

    res.status(200).json({
      token,
      userId: loadedUser._id.toString(),
      expiresIn: expiredDuration,
      email: loadedUser.email
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};


