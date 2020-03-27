const { check } = require('express-validator');
const { validateRepeatDays } = require('../utils');

exports.task = () => [
  check('title')
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
