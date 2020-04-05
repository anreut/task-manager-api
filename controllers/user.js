const User = require('../models/user');
const Task = require('../models/task');

/**
 * DELETE THE USER BY ID
 */
exports.deleteUser = (req, res, next) => {
  return User.findByIdAndRemove(req.params.id, {
    useFindAndModify: false,
  })
    .then(() => {
      return Task.deleteMany({
        user: req.params.id,
      });
    })
    .then(() => {
      res.status(200).json({
        msg: '👌 User was successfully deleted',
      });
    })
    .catch(() => {
      res.status(412).json({
        errors: [{ msg: 'Unable to delete user' }],
      });
      next();
    });
};
