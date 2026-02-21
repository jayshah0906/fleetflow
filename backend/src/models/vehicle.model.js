// Vehicle model - database queries and data access
const pool = require('../config/database');

class VehicleModel {
  // Create a new vehicle
  async create({ license_plate, max_capacity_kg, odometer_km = 0 }) {
    const query = `
      INSERT INTO vehicles (license_plate, max_capacity_kg, odometer_km)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [license_plate, max_capacity_kg, odometer_km]);
    return result.rows[0];
  }

  // Find all vehicles with pagination and optional status filter
  async findAll({ page = 1, limit = 50, status = null }) {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM vehicles';
    const params = [];
    
    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    // Get total count
    const countQuery = status ? 'SELECT COUNT(*) FROM vehicles WHERE status = $1' : 'SELECT COUNT(*) FROM vehicles';
    const countParams = status ? [status] : [];
    const countResult = await pool.query(countQuery, countParams);
    
    return {
      vehicles: result.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  // Find vehicle by ID
  async findById(id) {
    const query = 'SELECT * FROM vehicles WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Update vehicle
  async update(id, { max_capacity_kg, odometer_km, status }) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (max_capacity_kg !== undefined) {
      fields.push(`max_capacity_kg = $${paramCount++}`);
      values.push(max_capacity_kg);
    }
    if (odometer_km !== undefined) {
      fields.push(`odometer_km = $${paramCount++}`);
      values.push(odometer_km);
    }
    if (status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(status);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `UPDATE vehicles SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete vehicle
  async delete(id) {
    const query = 'DELETE FROM vehicles WHERE id = $1';
    await pool.query(query, [id]);
  }

  // Check if vehicle has active trips
  async hasActiveTrips(id) {
    const query = `SELECT COUNT(*) FROM trips WHERE vehicle_id = $1 AND status = 'In Progress'`;
    const result = await pool.query(query, [id]);
    return parseInt(result.rows[0].count) > 0;
  }
}

module.exports = new VehicleModel();
