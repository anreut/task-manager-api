const express = require('express');
const authController = require('../controllers/auth');
const validationHandler = require('../middleware/validationHandler');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

/**
 * GET
 * /api/auth/refresh
 */
router.get('/refresh', isAuth, authController.getUser);

/**
 * POST
 * /api/auth/signup
 */
router.post(
  '/signup',
  validationHandler.user(),
  authController.signup,
);

/**
 * POST
 * /api/auth/login
 */
router.post('/login', authController.login);

module.exports = router;
