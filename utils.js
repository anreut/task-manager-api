const jwt = require('jsonwebtoken');
const User = require('./models/user');

const weekDays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

exports.validateRepeatDays = days => {
  if (days.length !== 0) {
    return days.every(day => weekDays.includes(day.toLowerCase()));
  }
  return false;
};

// Check if email is already exists
exports.validateEmail = (value, { req }) => {
  return User.findOne({ email: value }).then(doc => {
    if (doc) {
      return Promise.reject('Email already exists');
    }
  });
};

// Generate JWT
exports.generateToken = (payload = {}, secret, expiration) => {
  return jwt.sign(payload, secret, { expiresIn: expiration });
};
