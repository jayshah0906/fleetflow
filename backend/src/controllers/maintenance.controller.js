// Maintenance controller - business logic and request handling
const maintenanceService = require('../services/maintenance.service');
const logger = require('../utils/logger');

class MaintenanceController {
  // GET /api/maintenance - List all maintenance records
  async getAllMaintenance(req, res, next) {
    try {
      const { page, limit, vehicle_id, status } = req.query;
      
      const result = await maintenanceService.getAllMaintenance({
        page,
        limit,
        vehicle_id,
        status,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error fetching maintenance records', {
        requestId: req.id,
        error: error.message,
      });
      
      if (error.message === 'Invalid maintenance status') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
      
      next(error);
    }
  }

  // GET /api/maintenance/:id - Get maintenance by ID
  async getMaintenanceById(req, res, next) {
    try {
      const { id } = req.params;
      const maintenance = await maintenanceService.getMaintenanceById(id);

      res.json({
        success: true,
        data: maintenance,
      });
    } catch (error) {
      logger.error('Error fetching maintenance record', {
        requestId: req.id,
        maintenanceId: req.params.id,
        error: error.message,
      });
      
      if (error.message === 'Maintenance record not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      
      next(error);
    }
  }

  // POST /api/maintenance - Create new maintenance record
  async createMaintenance(req, res, next) {
    try {
      const { vehicle_id, service_type, cost, service_date, description } = req.body;

      // Validate required fields
      if (!vehicle_id || !service_type || cost === undefined || !service_date) {
        return res.status(400).json({
          success: false,
          error: 'All maintenance fields are required',
        });
      }

      const maintenance = await maintenanceService.createMaintenance({
        vehicle_id,
        service_type,
        cost,
        service_date,
        description,
      });

      logger.info('Maintenance record created', {
        requestId: req.id,
        maintenanceId: maintenance.id,
        userId: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: maintenance,
        message: 'Vehicle status updated to In Shop',
      });
    } catch (error) {
      logger.error('Error creating maintenance record', {
        requestId: req.id,
        userId: req.user.id,
        error: error.message,
      });

      if (error.message === 'Cost must be a non-negative number' ||
          error.message === 'All maintenance fields are required') {
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

  // PUT /api/maintenance/:id/complete - Complete maintenance
  async completeMaintenance(req, res, next) {
    try {
      const { id } = req.params;

      const maintenance = await maintenanceService.completeMaintenance(id);

      logger.info('Maintenance completed', {
        requestId: req.id,
        maintenanceId: id,
        userId: req.user.id,
      });

      res.json({
        success: true,
        data: maintenance,
        message: 'Vehicle status updated to Available',
      });
    } catch (error) {
      logger.error('Error completing maintenance', {
        requestId: req.id,
        maintenanceId: req.params.id,
        userId: req.user.id,
        error: error.message,
      });

      if (error.message === 'Maintenance record not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === 'Maintenance is already completed') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      next(error);
    }
  }
}

module.exports = new MaintenanceController();
