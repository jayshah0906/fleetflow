// Expense routes
const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');

// All routes require authentication
router.use(authenticateToken);

// GET /api/expenses - List all expense records (all authenticated users)
router.get('/', expenseController.getAllExpenses.bind(expenseController));

// GET /api/expenses/:id - Get expense by ID (all authenticated users)
router.get('/:id', expenseController.getExpenseById.bind(expenseController));

// POST /api/expenses - Create new expense record (Financial Analyst, Fleet Manager)
router.post(
  '/',
  checkRole('Financial Analyst', 'Fleet Manager'),
  expenseController.createExpense.bind(expenseController)
);

module.exports = router;
