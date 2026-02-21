// Trip service - core business logic
const tripModel = require('../models/trip.model');
const vehicleModel = require('../models/vehicle.model');
const driverModel = require('../models/driver.model');
const validators = require('../utils/validators');
const websocketManager = require('../utils/websocket');

class TripService {
  // Create a new trip with validation
  async createTrip({ driver_id, vehicle_id, origin, destination, cargo_weight_kg, created_by }) {
    // Validate required fields
    if (!driver_id || !vehicle_id || !origin || !destination || !cargo_weight_kg) {
      throw new Error('All trip fields are required');
    }

    // Validate cargo weight is positive
    if (cargo_weight_kg <= 0) {
      throw new Error('Cargo weight must be a positive number');
    }

    // Get vehicle details
    const vehicle = await vehicleModel.findById(vehicle_id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    // Validate vehicle status is Available
    if (vehicle.status !== 'Available') {
      throw new Error('Vehicle not available');
    }

    // Validate cargo weight doesn't exceed vehicle capacity
    if (cargo_weight_kg > vehicle.max_capacity_kg) {
      throw new Error('Cargo exceeds vehicle capacity');
    }

    // Get driver details
    const driver = await driverModel.findById(driver_id);
    if (!driver) {
      throw new Error('Driver not found');
    }

    // Validate driver license is not expired
    const isLicenseValid = await driverModel.isLicenseValid(driver_id);
    if (!isLicenseValid) {
      throw new Error('Driver license expired');
    }

    // Sanitize inputs
    const sanitizedData = {
      driver_id,
      vehicle_id,
      origin: validators.sanitizeInput(origin),
      destination: validators.sanitizeInput(destination),
      cargo_weight_kg,
      created_by,
    };

    // Create trip (this will also update vehicle status to "On Trip" in a transaction)
    const trip = await tripModel.create(sanitizedData);
    
    // Broadcast WebSocket events
    websocketManager.broadcast('vehicle_status_changed', {
      vehicle_id,
      license_plate: vehicle.license_plate,
      old_status: 'Available',
      new_status: 'On Trip',
      timestamp: new Date().toISOString(),
    });
    
    websocketManager.broadcast('trip_created', {
      trip_id: trip.id,
      vehicle_id,
      driver_id,
      status: 'In Progress',
      timestamp: new Date().toISOString(),
    });
    
    websocketManager.broadcast('kpi_update', {
      type: 'trip_created',
      timestamp: new Date().toISOString(),
    });
    
    return trip;
  }

  // Get all trips with pagination and filters
  async getAllTrips({ page = 1, limit = 50, status = null, vehicle_id = null, driver_id = null }) {
    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));

    // Validate status if provided
    const validStatuses = ['In Progress', 'Completed', 'Cancelled'];
    if (status && !validStatuses.includes(status)) {
      throw new Error('Invalid trip status');
    }

    const result = await tripModel.findAll({
      page: pageNum,
      limit: limitNum,
      status,
      vehicle_id: vehicle_id ? parseInt(vehicle_id) : null,
      driver_id: driver_id ? parseInt(driver_id) : null,
    });

    return {
      trips: result.trips,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: result.total,
        pages: Math.ceil(result.total / limitNum),
      },
    };
  }

  // Get trip by ID
  async getTripById(id) {
    const trip = await tripModel.findById(id);
    if (!trip) {
      throw new Error('Trip not found');
    }
    return trip;
  }

  // Complete a trip
  async completeTrip(id) {
    // Check if trip exists
    const trip = await tripModel.findById(id);
    if (!trip) {
      throw new Error('Trip not found');
    }

    // Check if trip is already completed
    if (trip.status === 'Completed') {
      throw new Error('Trip is already completed');
    }

    // Check if trip is cancelled
    if (trip.status === 'Cancelled') {
      throw new Error('Cannot complete a cancelled trip');
    }

    // Complete trip (this will also update vehicle status to "Available" in a transaction)
    const completedTrip = await tripModel.complete(id);
    
    // Calculate duration
    const startTime = new Date(trip.start_time);
    const endTime = new Date(completedTrip.end_time);
    const durationHours = ((endTime - startTime) / (1000 * 60 * 60)).toFixed(2);
    
    // Broadcast WebSocket events
    websocketManager.broadcast('vehicle_status_changed', {
      vehicle_id: trip.vehicle.id,
      license_plate: trip.vehicle.license_plate,
      old_status: 'On Trip',
      new_status: 'Available',
      timestamp: new Date().toISOString(),
    });
    
    websocketManager.broadcast('trip_completed', {
      trip_id: id,
      vehicle_id: trip.vehicle.id,
      duration_hours: parseFloat(durationHours),
      timestamp: new Date().toISOString(),
    });
    
    websocketManager.broadcast('kpi_update', {
      type: 'trip_completed',
      timestamp: new Date().toISOString(),
    });
    
    return completedTrip;
  }

  // Cancel a trip
  async cancelTrip(id) {
    // Check if trip exists
    const trip = await tripModel.findById(id);
    if (!trip) {
      throw new Error('Trip not found');
    }

    // Check if trip is already completed
    if (trip.status === 'Completed') {
      throw new Error('Cannot cancel a completed trip');
    }

    // Check if trip is already cancelled
    if (trip.status === 'Cancelled') {
      throw new Error('Trip is already cancelled');
    }

    // Cancel trip and update vehicle status back to Available
    const cancelledTrip = await tripModel.cancel(id);
    
    // Update vehicle status back to Available
    await vehicleModel.update(trip.vehicle.id, { status: 'Available' });
    
    // Broadcast WebSocket events
    websocketManager.broadcast('vehicle_status_changed', {
      vehicle_id: trip.vehicle.id,
      license_plate: trip.vehicle.license_plate,
      old_status: 'On Trip',
      new_status: 'Available',
      timestamp: new Date().toISOString(),
    });
    
    websocketManager.broadcast('kpi_update', {
      type: 'trip_cancelled',
      timestamp: new Date().toISOString(),
    });
    
    return cancelledTrip;
  }
}

module.exports = new TripService();
