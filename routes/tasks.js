const express = require('express');
const tasksController = require('../controllers/tasks');
const validationHandler = require('../handlers/validationHandler');

const router = express.Router();

/**
 * GET
 * /api/tasks
 */
router.get('/tasks', tasksController.getTasks);

/**
 * POST
 * /api/task
 */
router.post(
  '/task',
  validationHandler.task(),
  tasksController.postTask,
);

/**
 * PUT
 * /api/task/:id
 */
router.put(
  '/task/:id',
  validationHandler.task(),
  tasksController.updateTask,
);

/**
 * DELETE
 * /api/task/:id
 */
router.delete('/task/:id', tasksController.deleteTask);

module.exports = router;
