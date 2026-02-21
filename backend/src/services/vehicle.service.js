// Vehicle service - core business logic
const vehicleModel = require('../models/vehicle.model');
const validators = require('../utils/validators');

class VehicleService {
  // Create a new vehicle
  async createVehicle({ license_plate, max_capacity_kg, odometer_km = 0 }) {
    // Validate license plate format
    if (!validators.isValidLicensePlate(license_plate)) {
      throw new Error('Invalid license plate format');
    }

    // Validate positive capacity
    if (max_capacity_kg <= 0) {
      throw new Error('Max capacity must be a positive number');
    }

    // Validate non-negative odometer
    if (odometer_km < 0) {
      throw new Error('Odometer cannot be negative');
    }

    // Sanitize inputs
    const sanitizedData = {
      license_plate: validators.sanitizeInput(license_plate),
      max_capacity_kg,
      odometer_km,
    };

    try {
      const vehicle = await vehicleModel.create(sanitizedData);
      return vehicle;
    } catch (error) {
      // Handle unique constraint violation
      if (error.code === '23505') {
        throw new Error('License plate already exists');
      }
      throw error;
    }
  }

  // Get all vehicles with pagination and filters
  async getAllVehicles({ page = 1, limit = 50, status = null }) {
    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));

    // Validate status if provided
    const validStatuses = ['Available', 'On Trip', 'In Shop', 'Retired'];
    if (status && !validStatuses.includes(status)) {
      throw new Error('Invalid vehicle status');
    }

    const result = await vehicleModel.findAll({
      page: pageNum,
      limit: limitNum,
      status,
    });

    return {
      vehicles: result.vehicles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: result.total,
        pages: Math.ceil(result.total / limitNum),
      },
    };
  }

  // Get vehicle by ID
  async getVehicleById(id) {
    const vehicle = await vehicleModel.findById(id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    return vehicle;
  }

  // Update vehicle
  async updateVehicle(id, { max_capacity_kg, odometer_km, status }) {
    // Get current vehicle
    const currentVehicle = await vehicleModel.findById(id);
    if (!currentVehicle) {
      throw new Error('Vehicle not found');
    }

    // Validate capacity if provided
    if (max_capacity_kg !== undefined && max_capacity_kg <= 0) {
      throw new Error('Max capacity must be a positive number');
    }

    // Validate odometer only increases
    if (odometer_km !== undefined && odometer_km < currentVehicle.odometer_km) {
      throw new Error('Odometer value can only increase');
    }

    // Validate status if provided
    const validStatuses = ['Available', 'On Trip', 'In Shop', 'Retired'];
    if (status !== undefined && !validStatuses.includes(status)) {
      throw new Error('Invalid vehicle status');
    }

    const updateData = {};
    if (max_capacity_kg !== undefined) updateData.max_capacity_kg = max_capacity_kg;
    if (odometer_km !== undefined) updateData.odometer_km = odometer_km;
    if (status !== undefined) updateData.status = status;

    const updatedVehicle = await vehicleModel.update(id, updateData);
    return updatedVehicle;
  }

  // Delete vehicle
  async deleteVehicle(id) {
    // Check if vehicle exists
    const vehicle = await vehicleModel.findById(id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    // Check for active trips
    const hasActiveTrips = await vehicleModel.hasActiveTrips(id);
    if (hasActiveTrips) {
      throw new Error('Cannot delete vehicle with active trips');
    }

    await vehicleModel.delete(id);
  }
}

module.exports = new VehicleService();
