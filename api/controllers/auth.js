const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { HttpError } = require('../models/http-error');
const User = require('../models/user');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  const newUser = new User({ email, password: hashedPassword });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      'supersecret_dont_share',
      {
        expiresIn: '1h',
      }
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res.status(201).json({
    userId: newUser.id,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
    token,
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let loadedUser;

  try {
    loadedUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Loggin in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!loadedUser) {
    const error = new HttpError('No Such user, could not log you in.', 403);
    return next(error);
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, loadedUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: loadedUser.id, email: loadedUser.email },
      'supersecret_dont_share',
      {
        expiresIn: '1h',
      }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    userId: loadedUser.id,
    email: loadedUser.email,
    isAdmin: loadedUser.isAdmin,
    token: token,
  });
};
