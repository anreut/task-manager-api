const { check } = require('express-validator');
const { validateRepeatDays, validateEmail } = require('../utils');

exports.task = () => [
  check('title', 'Title is required')
    .isString()
    .notEmpty()
    .trim(),
  check('dueDate').isBoolean(),
  check('repeat').isBoolean(),
  check('repeatDays')
    .if((_, { req }) => req.body.repeat)
    .isArray()
    .custom(validateRepeatDays),
  check('tags').isArray(),
  check('priority')
    .isString()
    .isIn(['low', 'medium', 'high']),
];

exports.user = () => [
  check('name', 'Name is required')
    .isString()
    .notEmpty()
    .trim(),
  check('email', 'Email is required')
    .isEmail()
    .custom(validateEmail)
    .normalizeEmail(),
  check(
    'password',
    'Please enter a password with 5 or more characters',
  )
    .trim()
    .isLength({ min: 5 }),
];
