// Dashboard controller - business logic and request handling
const analyticsService = require('../services/analytics.service');
const logger = require('../utils/logger');

class DashboardController {
  // GET /api/dashboard/kpis - Get dashboard KPIs
  async getKPIs(req, res, next) {
    try {
      const kpis = await analyticsService.getDashboardKPIs();

      res.json({
        success: true,
        data: kpis,
      });
    } catch (error) {
      logger.error('Error fetching dashboard KPIs', {
        requestId: req.id,
        error: error.message,
      });
      next(error);
    }
  }

  // GET /api/dashboard/alerts - Get dashboard alerts
  async getAlerts(req, res, next) {
    try {
      const alerts = await analyticsService.getDashboardAlerts();

      res.json({
        success: true,
        data: alerts,
      });
    } catch (error) {
      logger.error('Error fetching dashboard alerts', {
        requestId: req.id,
        error: error.message,
      });
      next(error);
    }
  }

  // GET /api/dashboard/financial - Get financial summary
  async getFinancialSummary(req, res, next) {
    try {
      const { start_date, end_date, vehicle_id } = req.query;

      const summary = await analyticsService.getFinancialSummary({
        start_date,
        end_date,
        vehicle_id: vehicle_id ? parseInt(vehicle_id) : null,
      });

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      logger.error('Error fetching financial summary', {
        requestId: req.id,
        error: error.message,
      });
      next(error);
    }
  }
}

module.exports = new DashboardController();
