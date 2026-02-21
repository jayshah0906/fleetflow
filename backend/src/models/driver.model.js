// Driver model - database queries and data access
const pool = require('../config/database');

class DriverModel {
  // Create a new driver
  async create({ name, license_number, license_expiry, safety_score = 100 }) {
    const query = `
      INSERT INTO drivers (name, license_number, license_expiry, safety_score)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [name, license_number, license_expiry, safety_score]);
    return result.rows[0];
  }

  // Find all drivers with pagination and optional expiring_soon filter
  async findAll({ page = 1, limit = 50, expiring_soon = false }) {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM drivers';
    const params = [];
    
    if (expiring_soon) {
      query += ' WHERE license_expiry <= CURRENT_DATE + INTERVAL \'30 days\'';
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    // Get total count
    const countQuery = expiring_soon 
      ? 'SELECT COUNT(*) FROM drivers WHERE license_expiry <= CURRENT_DATE + INTERVAL \'30 days\''
      : 'SELECT COUNT(*) FROM drivers';
    const countResult = await pool.query(countQuery);
    
    return {
      drivers: result.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  // Find driver by ID
  async findById(id) {
    const query = 'SELECT * FROM drivers WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Update driver
  async update(id, { name, license_number, license_expiry, safety_score }) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (license_number !== undefined) {
      fields.push(`license_number = $${paramCount++}`);
      values.push(license_number);
    }
    if (license_expiry !== undefined) {
      fields.push(`license_expiry = $${paramCount++}`);
      values.push(license_expiry);
    }
    if (safety_score !== undefined) {
      fields.push(`safety_score = $${paramCount++}`);
      values.push(safety_score);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `UPDATE drivers SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete driver
  async delete(id) {
    const query = 'DELETE FROM drivers WHERE id = $1';
    await pool.query(query, [id]);
  }

  // Check if driver's license is valid (not expired)
  async isLicenseValid(id) {
    const query = 'SELECT license_expiry > CURRENT_DATE as is_valid FROM drivers WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0]?.is_valid || false;
  }

  // Get trip counts for a driver
  async getTripCounts(id) {
    const query = `
      SELECT 
        COUNT(*) as total_trips,
        COUNT(*) FILTER (WHERE status = 'In Progress') as active_trips
      FROM trips
      WHERE driver_id = $1
    `;
    const result = await pool.query(query, [id]);
    return {
      total_trips: parseInt(result.rows[0].total_trips) || 0,
      active_trips: parseInt(result.rows[0].active_trips) || 0,
    };
  }
}

module.exports = new DriverModel();
