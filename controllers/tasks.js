const { validationResult } = require('express-validator');
const Task = require('../models/task');

/**
 * GET TASKS
 */
exports.getTasks = (_, res, next) => {
  Task.find()
    .then(tasks => {
      res.status(200).json({ tasks });
    })
    .catch(err => {
      res.status(412).json({
        message: '💩 Oops! Cannot get tasks',
        error: err,
      });
      next(err);
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
      message: '💩 Entered data is invalid',
      errors,
    });
    throw new Error('Entered data is invalid');
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

  const task = new Task({
    title,
    dueDate,
    repeat,
    tags,
    priority,
  });

  if (dueDate) {
    Object.assign(task, { date });
  }

  if (repeat) {
    Object.assign(task, { repeatDays });
  } else {
    Object.assign(task, { repeatDays: undefined });
  }

  return task
    .save()
    .then(result =>
      res.status(201).json({
        message: '👌 New task is created successfully',
        task: result,
      }),
    )
    .catch(err => {
      res.status(412).json({
        message: '💩 Oops! New task creation failed',
        error: err,
      });
      next(err);
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
      message: '💩 Entered data is invalid',
      errors,
    });
    throw new Error('Entered data is invalid');
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

  return Task.findById(req.params.id)
    .then(task => {
      const updatedTask = Object.assign(task, {
        title,
        dueDate,
        repeat,
        tags,
        priority,
      });

      if (repeat) {
        updatedTask.repeatDays = repeatDays;
      } else {
        updatedTask.repeatDays = undefined;
      }

      if (dueDate) {
        updatedTask.date = date;
      } else {
        updatedTask.date = undefined;
      }

      return updatedTask.save();
    })
    .then(result => {
      res.status(200).json({
        message: '👌 The task was updated successfully',
        task: result,
      });
    })
    .catch(err => {
      res.status(412).json({
        message: '💩 Oops! The task update failed',
        error: err,
      });
      next(err);
    });
};

/**
 * DELETE THE TASK BY ID
 */
exports.deleteTask = (req, res, next) => {
  return Task.findByIdAndRemove(req.params.id, {
    useFindAndModify: false,
  })
    .then(result => {
      res.status(200).json({
        message: '👌 The task was deleted successfully',
        task: result,
      });
    })
    .catch(err => {
      res.status(412).json({
        message: '💩 Oops! Unable to delete task',
        error: err,
      });
      next(err);
    });
};
