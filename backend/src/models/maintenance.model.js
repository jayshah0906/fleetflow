// Maintenance model - database queries and data access
const pool = require('../config/database');

class MaintenanceModel {
  // Create maintenance record with transaction (updates vehicle status)
  async create({ vehicle_id, service_type, cost, service_date, description }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create maintenance record
      const maintenanceQuery = `
        INSERT INTO maintenance (vehicle_id, service_type, cost, service_date, description)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const maintenanceResult = await client.query(maintenanceQuery, [
        vehicle_id, service_type, cost, service_date, description
      ]);

      // Update vehicle status to "In Shop"
      const statusQuery = `UPDATE vehicles SET status = 'In Shop' WHERE id = $1`;
      await client.query(statusQuery, [vehicle_id]);

      await client.query('COMMIT');
      return maintenanceResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Find all maintenance records with pagination and optional filters
  async findAll({ page = 1, limit = 50, vehicle_id = null, status = null }) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT m.*, v.license_plate as vehicle_license_plate
      FROM maintenance m
      JOIN vehicles v ON m.vehicle_id = v.id
    `;
    const params = [];
    const conditions = [];
    
    if (vehicle_id) {
      conditions.push(`m.vehicle_id = $${params.length + 1}`);
      params.push(vehicle_id);
    }
    if (status) {
      conditions.push(`m.status = $${params.length + 1}`);
      params.push(status);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ` ORDER BY m.service_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM maintenance m';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = await pool.query(countQuery, params.slice(0, -2));
    
    return {
      maintenance: result.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  // Find maintenance record by ID
  async findById(id) {
    const query = `
      SELECT m.*, v.license_plate as vehicle_license_plate
      FROM maintenance m
      JOIN vehicles v ON m.vehicle_id = v.id
      WHERE m.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Complete maintenance with transaction (updates vehicle status)
  async complete(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Get vehicle_id
      const getVehicleQuery = 'SELECT vehicle_id FROM maintenance WHERE id = $1';
      const vehicleResult = await client.query(getVehicleQuery, [id]);
      const vehicle_id = vehicleResult.rows[0].vehicle_id;

      // Complete maintenance
      const maintenanceQuery = `UPDATE maintenance SET status = 'Completed' WHERE id = $1 RETURNING *`;
      const maintenanceResult = await client.query(maintenanceQuery, [id]);

      // Update vehicle status back to Available
      const statusQuery = `UPDATE vehicles SET status = 'Available' WHERE id = $1`;
      await client.query(statusQuery, [vehicle_id]);

      await client.query('COMMIT');
      return maintenanceResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Update maintenance record
  async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['service_type', 'cost', 'service_date', 'description', 'status'];
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        fields.push(`${field} = $${paramCount++}`);
        values.push(updates[field]);
      }
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `UPDATE maintenance SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete maintenance record
  async delete(id) {
    const query = 'DELETE FROM maintenance WHERE id = $1';
    await pool.query(query, [id]);
  }
}

module.exports = new MaintenanceModel();
