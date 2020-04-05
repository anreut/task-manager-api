const express = require('express');
const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

/**
 * DELETE
 * /api/user/:id
 */
router.delete('/:id', isAuth, userController.deleteUser);

module.exports = router;
