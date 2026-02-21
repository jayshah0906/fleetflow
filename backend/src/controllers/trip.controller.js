// Trip controller - business logic and request handling
const tripService = require('../services/trip.service');
const logger = require('../utils/logger');

class TripController {
  // GET /api/trips - List all trips
  async getAllTrips(req, res, next) {
    try {
      const { page, limit, status, vehicle_id, driver_id } = req.query;
      
      const result = await tripService.getAllTrips({
        page,
        limit,
        status,
        vehicle_id,
        driver_id,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error fetching trips', {
        requestId: req.id,
        error: error.message,
      });
      
      if (error.message === 'Invalid trip status') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
      
      next(error);
    }
  }

  // GET /api/trips/:id - Get trip by ID
  async getTripById(req, res, next) {
    try {
      const { id } = req.params;
      const trip = await tripService.getTripById(id);

      res.json({
        success: true,
        data: trip,
      });
    } catch (error) {
      logger.error('Error fetching trip', {
        requestId: req.id,
        tripId: req.params.id,
        error: error.message,
      });
      
      if (error.message === 'Trip not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      
      next(error);
    }
  }

  // POST /api/trips - Create new trip
  async createTrip(req, res, next) {
    try {
      const { driver_id, vehicle_id, origin, destination, cargo_weight_kg } = req.body;

      // Validate required fields
      if (!driver_id || !vehicle_id || !origin || !destination || !cargo_weight_kg) {
        return res.status(400).json({
          success: false,
          error: 'All trip fields are required',
        });
      }

      const trip = await tripService.createTrip({
        driver_id,
        vehicle_id,
        origin,
        destination,
        cargo_weight_kg,
        created_by: req.user.id,
      });

      logger.info('Trip created', {
        requestId: req.id,
        tripId: trip.id,
        userId: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: trip,
      });
    } catch (error) {
      logger.error('Error creating trip', {
        requestId: req.id,
        userId: req.user.id,
        error: error.message,
      });

      if (error.message === 'Cargo exceeds vehicle capacity' ||
          error.message === 'Driver license expired' ||
          error.message === 'Vehicle not available' ||
          error.message === 'Cargo weight must be a positive number' ||
          error.message === 'All trip fields are required') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === 'Vehicle not found' || error.message === 'Driver not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      next(error);
    }
  }

  // PUT /api/trips/:id/complete - Complete a trip
  async completeTrip(req, res, next) {
    try {
      const { id } = req.params;

      const trip = await tripService.completeTrip(id);

      logger.info('Trip completed', {
        requestId: req.id,
        tripId: id,
        userId: req.user.id,
      });

      res.json({
        success: true,
        data: trip,
      });
    } catch (error) {
      logger.error('Error completing trip', {
        requestId: req.id,
        tripId: req.params.id,
        userId: req.user.id,
        error: error.message,
      });

      if (error.message === 'Trip not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === 'Trip is already completed' ||
          error.message === 'Cannot complete a cancelled trip') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      next(error);
    }
  }

  // DELETE /api/trips/:id - Cancel a trip
  async cancelTrip(req, res, next) {
    try {
      const { id } = req.params;

      await tripService.cancelTrip(id);

      logger.info('Trip cancelled', {
        requestId: req.id,
        tripId: id,
        userId: req.user.id,
      });

      res.json({
        success: true,
        message: 'Trip cancelled successfully',
      });
    } catch (error) {
      logger.error('Error cancelling trip', {
        requestId: req.id,
        tripId: req.params.id,
        userId: req.user.id,
        error: error.message,
      });

      if (error.message === 'Trip not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === 'Cannot cancel a completed trip' ||
          error.message === 'Trip is already cancelled') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      next(error);
    }
  }
}

module.exports = new TripController();
