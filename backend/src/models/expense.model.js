// Expense model - database queries and data access
const pool = require('../config/database');

class ExpenseModel {
  // Create a new expense record
  async create({ vehicle_id, expense_type, amount, fuel_liters, expense_date, description }) {
    const query = `
      INSERT INTO expenses (vehicle_id, expense_type, amount, fuel_liters, expense_date, description)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [
      vehicle_id, expense_type, amount, fuel_liters, expense_date, description
    ]);
    return result.rows[0];
  }

  // Find all expenses with pagination and optional filters
  async findAll({ page = 1, limit = 50, vehicle_id = null, expense_type = null, start_date = null, end_date = null }) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT e.*, v.license_plate as vehicle_license_plate
      FROM expenses e
      JOIN vehicles v ON e.vehicle_id = v.id
    `;
    const params = [];
    const conditions = [];
    
    if (vehicle_id) {
      conditions.push(`e.vehicle_id = $${params.length + 1}`);
      params.push(vehicle_id);
    }
    if (expense_type) {
      conditions.push(`e.expense_type = $${params.length + 1}`);
      params.push(expense_type);
    }
    if (start_date) {
      conditions.push(`e.expense_date >= $${params.length + 1}`);
      params.push(start_date);
    }
    if (end_date) {
      conditions.push(`e.expense_date <= $${params.length + 1}`);
      params.push(end_date);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ` ORDER BY e.expense_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM expenses e';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = await pool.query(countQuery, params.slice(0, -2));
    
    return {
      expenses: result.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  // Find expense by ID
  async findById(id) {
    const query = `
      SELECT e.*, v.license_plate as vehicle_license_plate
      FROM expenses e
      JOIN vehicles v ON e.vehicle_id = v.id
      WHERE e.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Get total expenses by vehicle
  async getTotalByVehicle(vehicle_id) {
    const query = `SELECT SUM(amount) as total FROM expenses WHERE vehicle_id = $1`;
    const result = await pool.query(query, [vehicle_id]);
    return parseFloat(result.rows[0].total) || 0;
  }

  // Get total fuel expenses by vehicle
  async getFuelExpensesByVehicle(vehicle_id) {
    const query = `
      SELECT SUM(amount) as total_fuel_cost, SUM(fuel_liters) as total_fuel_liters
      FROM expenses 
      WHERE vehicle_id = $1 AND expense_type = 'Fuel'
    `;
    const result = await pool.query(query, [vehicle_id]);
    return {
      total_fuel_cost: parseFloat(result.rows[0].total_fuel_cost) || 0,
      total_fuel_liters: parseFloat(result.rows[0].total_fuel_liters) || 0
    };
  }

  // Get expenses aggregated by type for a vehicle
  async getExpensesByType(vehicle_id) {
    const query = `
      SELECT expense_type, SUM(amount) as total
      FROM expenses 
      WHERE vehicle_id = $1
      GROUP BY expense_type
      ORDER BY total DESC
    `;
    const result = await pool.query(query, [vehicle_id]);
    return result.rows;
  }

  // Get expenses aggregated by type for all vehicles
  async getAllExpensesByType() {
    const query = `
      SELECT expense_type, SUM(amount) as total
      FROM expenses 
      GROUP BY expense_type
      ORDER BY total DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Get total expenses for date range
  async getTotalByDateRange(start_date, end_date) {
    const query = `
      SELECT SUM(amount) as total
      FROM expenses 
      WHERE expense_date >= $1 AND expense_date <= $2
    `;
    const result = await pool.query(query, [start_date, end_date]);
    return parseFloat(result.rows[0].total) || 0;
  }

  // Update expense record
  async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['expense_type', 'amount', 'fuel_liters', 'expense_date', 'description'];
    
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
    const query = `UPDATE expenses SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete expense record
  async delete(id) {
    const query = 'DELETE FROM expenses WHERE id = $1';
    await pool.query(query, [id]);
  }
}

module.exports = new ExpenseModel();
