// User model - database queries and data access
const pool = require('../config/database');

class UserModel {
  // Create a new user
  async create({ username, password_hash, email, role }) {
    const query = `
      INSERT INTO users (username, password_hash, email, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, role, created_at
    `;
    const result = await pool.query(query, [username, password_hash, email, role]);
    return result.rows[0];
  }

  // Find user by username (for login)
  async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
  }

  // Find user by ID (for token verification)
  async findById(id) {
    const query = 'SELECT id, username, email, role, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = new UserModel();
