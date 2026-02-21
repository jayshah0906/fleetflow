// Driver service - core business logic
const driverModel = require('../models/driver.model');
const validators = require('../utils/validators');

class DriverService {
  // Create a new driver
  async createDriver({ name, license_number, license_expiry, safety_score = 100 }) {
    // Validate license expiry is in the future
    const expiryDate = new Date(license_expiry);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (expiryDate <= today) {
      throw new Error('License expiry date must be in the future');
    }

    // Validate safety score range
    if (safety_score < 0 || safety_score > 100) {
      throw new Error('Safety score must be between 0 and 100');
    }

    // Sanitize inputs
    const sanitizedData = {
      name: validators.sanitizeInput(name),
      license_number: validators.sanitizeInput(license_number),
      license_expiry,
      safety_score,
    };

    try {
      const driver = await driverModel.create(sanitizedData);
      return driver;
    } catch (error) {
      // Handle unique constraint violation
      if (error.code === '23505') {
        throw new Error('License number already exists');
      }
      throw error;
    }
  }

  // Get all drivers with pagination and filters
  async getAllDrivers({ page = 1, limit = 50, expiring_soon = false }) {
    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));

    const result = await driverModel.findAll({
      page: pageNum,
      limit: limitNum,
      expiring_soon: expiring_soon === 'true' || expiring_soon === true,
    });

    // Add license_expiring_soon flag to each driver
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const driversWithFlags = result.drivers.map(driver => {
      const expiryDate = new Date(driver.license_expiry);
      return {
        ...driver,
        license_expiring_soon: expiryDate <= thirtyDaysFromNow && expiryDate > today,
      };
    });

    return {
      drivers: driversWithFlags,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: result.total,
        pages: Math.ceil(result.total / limitNum),
      },
    };
  }

  // Get driver by ID
  async getDriverById(id) {
    const driver = await driverModel.findById(id);
    if (!driver) {
      throw new Error('Driver not found');
    }

    // Get trip counts
    const { total_trips, active_trips } = await driverModel.getTripCounts(id);

    return {
      ...driver,
      total_trips,
      active_trips,
    };
  }

  // Update driver
  async updateDriver(id, { license_expiry, safety_score }) {
    // Get current driver
    const currentDriver = await driverModel.findById(id);
    if (!currentDriver) {
      throw new Error('Driver not found');
    }

    // Validate license expiry if provided
    if (license_expiry !== undefined) {
      const expiryDate = new Date(license_expiry);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (expiryDate <= today) {
        throw new Error('License expiry date must be in the future');
      }
    }

    // Validate safety score if provided
    if (safety_score !== undefined && (safety_score < 0 || safety_score > 100)) {
      throw new Error('Safety score must be between 0 and 100');
    }

    const updateData = {};
    if (license_expiry !== undefined) updateData.license_expiry = license_expiry;
    if (safety_score !== undefined) updateData.safety_score = safety_score;

    const updatedDriver = await driverModel.update(id, updateData);
    return updatedDriver;
  }

  // Delete driver
  async deleteDriver(id) {
    // Check if driver exists
    const driver = await driverModel.findById(id);
    if (!driver) {
      throw new Error('Driver not found');
    }

    // Check for active trips
    const { active_trips } = await driverModel.getTripCounts(id);
    if (active_trips > 0) {
      throw new Error('Cannot delete driver with active trips');
    }

    await driverModel.delete(id);
  }
}

module.exports = new DriverService();
