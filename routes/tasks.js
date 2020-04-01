const express = require('express');
const tasksController = require('../controllers/tasks');
const validationHandler = require('../middleware/validationHandler');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

/**
 * GET
 * /api/tasks
 */
router.get('/tasks', isAuth, tasksController.getTasks);

/**
 * POST
 * /api/task
 */
router.post(
  '/task',
  isAuth,
  validationHandler.task(),
  tasksController.postTask,
);

/**
 * PUT
 * /api/task/:id
 */
router.put(
  '/task/:id',
  isAuth,
  validationHandler.task(),
  tasksController.updateTask,
);

/**
 * DELETE
 * /api/task/:id
 */
router.delete('/task/:id', isAuth, tasksController.deleteTask);

module.exports = router;
