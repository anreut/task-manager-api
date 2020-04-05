const { validationResult } = require('express-validator');
const Task = require('../models/task');
const User = require('../models/user');

/**
 * GET TASKS
 */
exports.getTasks = (req, res, next) => {
  Task.find({ user: req.id }, '-user -__v')
    .then((tasks) => {
      res.status(200).json({ tasks });
    })
    .catch(() => {
      res.status(412).json({
        errors: [{ msg: 'Cannot get tasks' }],
      });
      next();
    });
};

/**
 * POST A TASK
 */
exports.postTask = (req, res, next) => {
  const errors = validationResult(req);
  // if data is invalid
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array(),
    });
  }

  const {
    title,
    dueDate,
    date,
    repeat,
    repeatDays,
    tags,
    priority,
  } = req.body;

  const newTask = new Task({
    title,
    dueDate,
    repeat,
    tags,
    priority,
    user: req.id,
  });

  if (dueDate) {
    newTask.date = date;
  } else {
    newTask.date = undefined;
  }

  // HACK
  // for some reason it always returns repeatDays: []
  if (repeat) {
    newTask.repeatDays = repeatDays;
  } else {
    newTask.repeatDays = undefined;
  }

  return newTask
    .save()
    .then(() => {
      return User.findById(req.id);
    })
    .then((user) => {
      user.tasks.push(newTask);
      // save user.tasks to DB
      return user.save();
    })
    .then(() => {
      res.status(201).json({
        msg: '👌 New task is created successfully',
        task: newTask,
      });
    })
    .catch(() => {
      res.status(412).json({
        errors: [{ msg: 'New task creation failed' }],
      });
      next();
    });
};

/**
 * UPDATE THE TASK BY ID
 */
exports.updateTask = (req, res, next) => {
  const errors = validationResult(req);
  // if data is invalid
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array(),
    });
  }

  const {
    title,
    dueDate,
    date,
    repeat,
    repeatDays,
    tags,
    priority,
  } = req.body;

  const unsetFields = [];
  // if dueDate = false remove `date` field
  if (!dueDate) {
    unsetFields.push('date');
  }
  // if repeat = false remove `repeatDays` field
  if (!repeat) {
    unsetFields.push('repeatDays');
  }

  const aggregation = [
    {
      $set: {
        title,
        dueDate,
        date,
        repeat,
        repeatDays,
        tags,
        priority,
      },
    },
  ];

  if (unsetFields.length !== 0) {
    aggregation.push({ $unset: unsetFields });
  }

  return Task.updateOne({ _id: req.params.id }, aggregation)
    .then(() => {
      res.status(200).json({
        msg: '👌 The task was successfully updated',
      });
    })
    .catch(() => {
      res.status(412).json({
        errors: [{ msg: 'The task update failed' }],
      });
      next();
    });
};

/**
 * DELETE THE TASK BY ID
 */
exports.deleteTask = (req, res, next) => {
  return Task.findByIdAndRemove(req.params.id, {
    useFindAndModify: false,
  })
    .then(() => {
      // find user with with task
      return User.findById(req.id);
    })
    .then((user) => {
      // delete task id by User doc
      user.tasks.pull(req.params.id);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({
        msg: '👌 The task was successfully deleted',
        task: result,
      });
    })
    .catch(() => {
      res.status(412).json({
        errors: [{ msg: 'Unable to delete task' }],
      });
      next();
    });
};
