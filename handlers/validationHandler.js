const { check } = require('express-validator');
const { validateRepeatDays, validateDate } = require('../utils');

exports.task = () => [
  check('title')
    .isString()
    .notEmpty()
    .trim(),
  check('dueDate').isBoolean(),
  check('date')
    .if((_, { req }) => req.body.dueDate)
    .custom(validateDate),
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
