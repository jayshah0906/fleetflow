// Driver controller - business logic and request handling
const driverService = require('../services/driver.service');
const logger = require('../utils/logger');

class DriverController {
  // GET /api/drivers - List all drivers
  async getAllDrivers(req, res, next) {
    try {
      const { page, limit, expiring_soon } = req.query;
      
      const result = await driverService.getAllDrivers({
        page,
        limit,
        expiring_soon,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error fetching drivers', {
        requestId: req.id,
        error: error.message,
      });
      next(error);
    }
  }

  // GET /api/drivers/:id - Get driver by ID
  async getDriverById(req, res, next) {
    try {
      const { id } = req.params;
      const driver = await driverService.getDriverById(id);

      res.json({
        success: true,
        data: driver,
      });
    } catch (error) {
      logger.error('Error fetching driver', {
        requestId: req.id,
        driverId: req.params.id,
        error: error.message,
      });
      
      if (error.message === 'Driver not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      
      next(error);
    }
  }

  // POST /api/drivers - Create new driver
  async createDriver(req, res, next) {
    try {
      const { name, license_number, license_expiry, safety_score } = req.body;

      // Validate required fields
      if (!name || !license_number || !license_expiry) {
        return res.status(400).json({
          success: false,
          error: 'Name, license number, and license expiry are required',
        });
      }

      const driver = await driverService.createDriver({
        name,
        license_number,
        license_expiry,
        safety_score,
      });

      logger.info('Driver created', {
        requestId: req.id,
        driverId: driver.id,
        userId: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: driver,
      });
    } catch (error) {
      logger.error('Error creating driver', {
        requestId: req.id,
        userId: req.user.id,
        error: error.message,
      });

      if (error.message === 'License number already exists' || 
          error.message === 'License expiry date must be in the future' ||
          error.message === 'Safety score must be between 0 and 100') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          error: 'License number already exists',
        });
      }

      next(error);
    }
  }

  // PUT /api/drivers/:id - Update driver
  async updateDriver(req, res, next) {
    try {
      const { id } = req.params;
      const { license_expiry, safety_score } = req.body;

      const driver = await driverService.updateDriver(id, {
        license_expiry,
        safety_score,
      });

      logger.info('Driver updated', {
        requestId: req.id,
        driverId: id,
        userId: req.user.id,
      });

      res.json({
        success: true,
        data: driver,
      });
    } catch (error) {
      logger.error('Error updating driver', {
        requestId: req.id,
        driverId: req.params.id,
        userId: req.user.id,
        error: error.message,
      });

      if (error.message === 'Driver not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === 'License expiry date must be in the future' ||
          error.message === 'Safety score must be between 0 and 100') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      next(error);
    }
  }

  // DELETE /api/drivers/:id - Delete driver
  async deleteDriver(req, res, next) {
    try {
      const { id } = req.params;

      await driverService.deleteDriver(id);

      logger.info('Driver deleted', {
        requestId: req.id,
        driverId: id,
        userId: req.user.id,
      });

      res.json({
        success: true,
        message: 'Driver deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting driver', {
        requestId: req.id,
        driverId: req.params.id,
        userId: req.user.id,
        error: error.message,
      });

      if (error.message === 'Driver not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === 'Cannot delete driver with active trips') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      next(error);
    }
  }
}

module.exports = new DriverController();
