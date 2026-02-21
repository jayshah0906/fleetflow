// Authentication routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/register - Register a new user
router.post('/register', authController.register.bind(authController));

// POST /api/auth/login - Login and receive JWT token
router.post('/login', authController.login.bind(authController));

// GET /api/auth/me - Get current user profile (requires authentication)
router.get('/me', authenticateToken, authController.getMe.bind(authController));

module.exports = router;
