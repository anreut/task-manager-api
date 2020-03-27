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

  const newTask = new Task({
    title,
    dueDate,
    repeat,
    tags,
    priority,
  });
  console.log('NEW_TASK', newTask);

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
        message: '👌 The task was successfully updated',
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
        message: '👌 The task was successfully deleted',
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
