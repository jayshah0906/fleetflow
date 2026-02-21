// Expense controller - business logic and request handling
const expenseService = require('../services/expense.service');
const logger = require('../utils/logger');

class ExpenseController {
  // GET /api/expenses - List all expense records
  async getAllExpenses(req, res, next) {
    try {
      const { page, limit, vehicle_id, expense_type, start_date, end_date } = req.query;
      
      const result = await expenseService.getAllExpenses({
        page,
        limit,
        vehicle_id,
        expense_type,
        start_date,
        end_date,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error fetching expense records', {
        requestId: req.id,
        error: error.message,
      });
      
      if (error.message === 'Invalid expense type') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
      
      next(error);
    }
  }

  // GET /api/expenses/:id - Get expense by ID
  async getExpenseById(req, res, next) {
    try {
      const { id } = req.params;
      const expense = await expenseService.getExpenseById(id);

      res.json({
        success: true,
        data: expense,
      });
    } catch (error) {
      logger.error('Error fetching expense record', {
        requestId: req.id,
        expenseId: req.params.id,
        error: error.message,
      });
      
      if (error.message === 'Expense record not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      
      next(error);
    }
  }

  // POST /api/expenses - Create new expense record
  async createExpense(req, res, next) {
    try {
      const { vehicle_id, expense_type, amount, fuel_liters, expense_date, description } = req.body;

      // Validate required fields
      if (!vehicle_id || !expense_type || !amount || !expense_date) {
        return res.status(400).json({
          success: false,
          error: 'Vehicle ID, expense type, amount, and expense date are required',
        });
      }

      const expense = await expenseService.createExpense({
        vehicle_id,
        expense_type,
        amount,
        fuel_liters,
        expense_date,
        description,
      });

      logger.info('Expense record created', {
        requestId: req.id,
        expenseId: expense.id,
        userId: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: expense,
      });
    } catch (error) {
      logger.error('Error creating expense record', {
        requestId: req.id,
        userId: req.user.id,
        error: error.message,
      });

      if (error.message === 'Amount must be a positive number' ||
          error.message === 'Invalid expense type' ||
          error.message === 'Fuel liters required for Fuel expenses' ||
          error.message === 'Fuel liters must be a positive number' ||
          error.message === 'Vehicle ID, expense type, amount, and expense date are required') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === 'Vehicle not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      next(error);
    }
  }
}

module.exports = new ExpenseController();
