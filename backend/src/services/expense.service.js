// Expense service - core business logic
const expenseModel = require('../models/expense.model');
const vehicleModel = require('../models/vehicle.model');
const validators = require('../utils/validators');

class ExpenseService {
  // Create a new expense record
  async createExpense({ vehicle_id, expense_type, amount, fuel_liters, expense_date, description }) {
    // Validate required fields
    if (!vehicle_id || !expense_type || !amount || !expense_date) {
      throw new Error('Vehicle ID, expense type, amount, and expense date are required');
    }

    // Validate amount is positive
    if (amount <= 0) {
      throw new Error('Amount must be a positive number');
    }

    // Validate expense type
    const validTypes = ['Fuel', 'Repair', 'Toll', 'Insurance', 'Other'];
    if (!validTypes.includes(expense_type)) {
      throw new Error('Invalid expense type');
    }

    // Validate fuel_liters is required for Fuel expenses
    if (expense_type === 'Fuel' && !fuel_liters) {
      throw new Error('Fuel liters required for Fuel expenses');
    }

    // Validate fuel_liters is positive if provided
    if (fuel_liters !== undefined && fuel_liters !== null && fuel_liters <= 0) {
      throw new Error('Fuel liters must be a positive number');
    }

    // Check if vehicle exists
    const vehicle = await vehicleModel.findById(vehicle_id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    // Sanitize inputs
    const sanitizedData = {
      vehicle_id,
      expense_type,
      amount,
      fuel_liters: fuel_liters || null,
      expense_date,
      description: description ? validators.sanitizeInput(description) : null,
    };

    const expense = await expenseModel.create(sanitizedData);
    return expense;
  }

  // Get all expense records with pagination and filters
  async getAllExpenses({ page = 1, limit = 50, vehicle_id = null, expense_type = null, start_date = null, end_date = null }) {
    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));

    // Validate expense type if provided
    const validTypes = ['Fuel', 'Repair', 'Toll', 'Insurance', 'Other'];
    if (expense_type && !validTypes.includes(expense_type)) {
      throw new Error('Invalid expense type');
    }

    const result = await expenseModel.findAll({
      page: pageNum,
      limit: limitNum,
      vehicle_id: vehicle_id ? parseInt(vehicle_id) : null,
      expense_type,
      start_date,
      end_date,
    });

    return {
      expenses: result.expenses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: result.total,
        pages: Math.ceil(result.total / limitNum),
      },
    };
  }

  // Get expense by ID
  async getExpenseById(id) {
    const expense = await expenseModel.findById(id);
    if (!expense) {
      throw new Error('Expense record not found');
    }
    return expense;
  }

  // Get total expenses by vehicle
  async getTotalByVehicle(vehicle_id) {
    const total = await expenseModel.getTotalByVehicle(vehicle_id);
    return total;
  }
}

module.exports = new ExpenseService();
