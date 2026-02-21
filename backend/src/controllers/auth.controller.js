// Authentication controller - business logic and request handling
const authService = require('../services/auth.service');
const logger = require('../utils/logger');

class AuthController {
  // POST /api/auth/register
  async register(req, res, next) {
    try {
      const { username, password, email, role } = req.body;

      // Validate required fields
      if (!username || !password || !email || !role) {
        return res.status(400).json({
          success: false,
          error: 'All fields are required: username, password, email, role',
        });
      }

      // Validate role
      const validRoles = ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          error: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
        });
      }

      // Validate password length
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 8 characters long',
        });
      }

      const user = await authService.register({ username, password, email, role });

      logger.info('User registered successfully', { username, role });

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      if (error.message === 'Username already exists') {
        return res.status(409).json({
          success: false,
          error: error.message,
        });
      }
      logger.error('Registration error', { error: error.message });
      next(error);
    }
  }

  // POST /api/auth/login
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // Validate required fields
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: 'Username and password are required',
        });
      }

      const result = await authService.login({ username, password });

      logger.info('User logged in successfully', { username });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        logger.warn('Failed login attempt', { username: req.body.username });
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }
      logger.error('Login error', { error: error.message });
      next(error);
    }
  }

  // GET /api/auth/me
  async getMe(req, res, next) {
    try {
      const user = await authService.getUserById(req.user.id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }
      logger.error('Get user error', { error: error.message });
      next(error);
    }
  }
}

module.exports = new AuthController();
