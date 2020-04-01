const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateToken } = require('../utils');

/**
 * GET USER
 */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    res.status(200).json({
      tokens: {
        access_token: req.tokens.access_token,
        refresh_token: req.tokens.refresh_token,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({ message: 'Authentication failed' });
  }
};

/**
 * POST NEW USER
 */
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  // if data is invalid
  if (!errors.isEmpty()) {
    res.status(422).json({
      message: '💩 Entered data is invalid',
      errors: errors.array(),
    });
    throw new Error('Entered data is invalid');
  }

  const { name, email, password } = req.body;

  try {
    // check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // encrypt password
    const hashedPsw = await bcrypt.hash(password, 12);

    // save user to DB
    user = new User({
      name,
      email,
      password: hashedPsw,
    });
    await user.save();

    // generate tokens
    // we can use `user.id` instead of `user._id` => Mongoose normalize the id
    const access_token = await generateToken(
      { id: user.id },
      process.env.JWT_ACCESS_SECRET,
      process.env.JWT_ACCESS_TIMEOUT,
    );
    const refresh_token = await generateToken(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      process.env.JWT_REFRESH_TIMEOUT,
    );

    return res.status(201).json({
      tokens: {
        access_token,
        refresh_token,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).send('User registration failed');
  }
};

/**
 * POST LOGIN
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('User does not exist');
    }

    // compare password
    const isPassCorrect = await bcrypt.compare(
      password,
      user.password,
    );
    if (!isPassCorrect) {
      return res.status(400).send('Incorrect password');
    }

    // generate tokens
    // we can use `user.id` instead of `user._id` => Mongoose normalize the id
    const access_token = await generateToken(
      { id: user.id },
      process.env.JWT_ACCESS_SECRET,
      process.env.JWT_ACCESS_TIMEOUT,
    );
    const refresh_token = await generateToken(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      process.env.JWT_REFRESH_TIMEOUT,
    );

    return res.status(201).json({
      tokens: {
        access_token,
        refresh_token,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).send('Authentication failed');
  }
};
