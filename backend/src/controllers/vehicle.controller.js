// Vehicle controller - request handling and response formatting
const vehicleService = require('../services/vehicle.service');
const logger = require('../utils/logger');

class VehicleController {
  // GET /api/vehicles - List all vehicles
  async getAllVehicles(req, res, next) {
    try {
      const { page, limit, status } = req.query;
      
      const result = await vehicleService.getAllVehicles({
        page,
        limit,
        status,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error fetching vehicles', {
        requestId: req.id,
        error: error.message,
      });
      next(error);
    }
  }

  // GET /api/vehicles/:id - Get vehicle by ID
  async getVehicleById(req, res, next) {
    try {
      const { id } = req.params;
      const vehicle = await vehicleService.getVehicleById(id);

      res.json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      logger.error('Error fetching vehicle', {
        requestId: req.id,
        vehicleId: req.params.id,
        error: error.message,
      });
      
      if (error.message === 'Vehicle not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      
      next(error);
    }
  }

  // POST /api/vehicles - Create new vehicle
  async createVehicle(req, res, next) {
    try {
      const { license_plate, max_capacity_kg, odometer_km } = req.body;

      // Validate required fields
      if (!license_plate || !max_capacity_kg) {
        return res.status(400).json({
          success: false,
          error: 'License plate and max capacity are required',
        });
      }

      const vehicle = await vehicleService.createVehicle({
        license_plate,
        max_capacity_kg,
        odometer_km,
      });

      logger.info('Vehicle created', {
        requestId: req.id,
        vehicleId: vehicle.id,
        userId: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      logger.error('Error creating vehicle', {
        requestId: req.id,
        userId: req.user.id,
        error: error.message,
      });

      if (error.message === 'License plate already exists' || 
          error.message === 'Invalid license plate format' ||
          error.message === 'Max capacity must be a positive number' ||
          error.message === 'Odometer cannot be negative') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          error: 'License plate already exists',
        });
      }

      next(error);
    }
  }

  // PUT /api/vehicles/:id - Update vehicle
  async updateVehicle(req, res, next) {
    try {
      const { id } = req.params;
      const { max_capacity_kg, odometer_km, status } = req.body;

      const vehicle = await vehicleService.updateVehicle(id, {
        max_capacity_kg,
        odometer_km,
        status,
      });

      logger.info('Vehicle updated', {
        requestId: req.id,
        vehicleId: id,
        userId: req.user.id,
      });

      res.json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      logger.error('Error updating vehicle', {
        requestId: req.id,
        vehicleId: req.params.id,
        userId: req.user.id,
        error: error.message,
      });

      if (error.message === 'Vehicle not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === 'Max capacity must be a positive number' ||
          error.message === 'Odometer value can only increase' ||
          error.message === 'Invalid vehicle status') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      next(error);
    }
  }

  // DELETE /api/vehicles/:id - Delete vehicle
  async deleteVehicle(req, res, next) {
    try {
      const { id } = req.params;

      await vehicleService.deleteVehicle(id);

      logger.info('Vehicle deleted', {
        requestId: req.id,
        vehicleId: id,
        userId: req.user.id,
      });

      res.json({
        success: true,
        message: 'Vehicle deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting vehicle', {
        requestId: req.id,
        vehicleId: req.params.id,
        userId: req.user.id,
        error: error.message,
      });

      if (error.message === 'Vehicle not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === 'Cannot delete vehicle with active trips') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      next(error);
    }
  }
}

module.exports = new VehicleController();
