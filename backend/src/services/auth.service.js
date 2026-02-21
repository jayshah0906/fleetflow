// Authentication service - core business logic
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const { config } = require('../config/env');

const SALT_ROUNDS = 10;

class AuthService {
  // Register a new user
  async register({ username, password, email, role }) {
    // Check if user already exists
    const existingUser = await userModel.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await userModel.create({
      username,
      password_hash,
      email,
      role,
    });

    return user;
  }

  // Login user and generate JWT
  async login({ username, password }) {
    // Find user
    const user = await userModel.findByUsername(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Get user by ID (for /me endpoint)
  async getUserById(id) {
    const user = await userModel.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new AuthService();
