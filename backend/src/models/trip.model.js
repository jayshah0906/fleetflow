// Trip model - database queries and data access
const pool = require('../config/database');

class TripModel {
  // Create a new trip with transaction (updates vehicle status)
  async create({ driver_id, vehicle_id, origin, destination, cargo_weight_kg, created_by }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create trip
      const tripQuery = `
        INSERT INTO trips (driver_id, vehicle_id, origin, destination, cargo_weight_kg, created_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const tripResult = await client.query(tripQuery, [
        driver_id, vehicle_id, origin, destination, cargo_weight_kg, created_by
      ]);

      // Update vehicle status to "On Trip"
      const statusQuery = `UPDATE vehicles SET status = 'On Trip' WHERE id = $1`;
      await client.query(statusQuery, [vehicle_id]);

      await client.query('COMMIT');
      return tripResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Find all trips with pagination and optional filters
  async findAll({ page = 1, limit = 50, status = null, vehicle_id = null, driver_id = null }) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT t.*, 
             d.name as driver_name, 
             v.license_plate as vehicle_license_plate
      FROM trips t
      JOIN drivers d ON t.driver_id = d.id
      JOIN vehicles v ON t.vehicle_id = v.id
    `;
    const params = [];
    const conditions = [];
    
    if (status) {
      conditions.push(`t.status = $${params.length + 1}`);
      params.push(status);
    }
    if (vehicle_id) {
      conditions.push(`t.vehicle_id = $${params.length + 1}`);
      params.push(vehicle_id);
    }
    if (driver_id) {
      conditions.push(`t.driver_id = $${params.length + 1}`);
      params.push(driver_id);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ` ORDER BY t.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM trips t';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = await pool.query(countQuery, params.slice(0, -2));
    
    return {
      trips: result.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  // Find trip by ID with related data
  async findById(id) {
    const query = `
      SELECT t.*, 
             json_build_object('id', d.id, 'name', d.name, 'license_number', d.license_number) as driver,
             json_build_object('id', v.id, 'license_plate', v.license_plate, 'max_capacity_kg', v.max_capacity_kg) as vehicle,
             json_build_object('id', u.id, 'username', u.username) as created_by_user
      FROM trips t
      JOIN drivers d ON t.driver_id = d.id
      JOIN vehicles v ON t.vehicle_id = v.id
      JOIN users u ON t.created_by = u.id
      WHERE t.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Complete a trip with transaction (updates vehicle status)
  async complete(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Get vehicle_id before completing
      const getVehicleQuery = 'SELECT vehicle_id FROM trips WHERE id = $1';
      const vehicleResult = await client.query(getVehicleQuery, [id]);
      const vehicle_id = vehicleResult.rows[0].vehicle_id;

      // Complete trip
      const tripQuery = `
        UPDATE trips 
        SET status = 'Completed', end_time = CURRENT_TIMESTAMP 
        WHERE id = $1 
        RETURNING *
      `;
      const tripResult = await client.query(tripQuery, [id]);

      // Update vehicle status back to Available
      const statusQuery = `UPDATE vehicles SET status = 'Available' WHERE id = $1`;
      await client.query(statusQuery, [vehicle_id]);

      await client.query('COMMIT');
      return tripResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Cancel a trip
  async cancel(id) {
    const query = `UPDATE trips SET status = 'Cancelled' WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Update trip
  async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['origin', 'destination', 'cargo_weight_kg', 'status', 'end_time'];
    
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
    const query = `UPDATE trips SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete trip
  async delete(id) {
    const query = 'DELETE FROM trips WHERE id = $1';
    await pool.query(query, [id]);
  }
}

module.exports = new TripModel();
