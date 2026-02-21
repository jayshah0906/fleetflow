// Dashboard routes
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// GET /api/dashboard/kpis - Get dashboard KPIs (all authenticated users)
router.get('/kpis', dashboardController.getKPIs.bind(dashboardController));

// GET /api/dashboard/alerts - Get dashboard alerts (all authenticated users)
router.get('/alerts', dashboardController.getAlerts.bind(dashboardController));

// GET /api/dashboard/financial - Get financial summary (all authenticated users)
router.get('/financial', dashboardController.getFinancialSummary.bind(dashboardController));

module.exports = router;
