// Maintenance service - core business logic
const maintenanceModel = require('../models/maintenance.model');
const vehicleModel = require('../models/vehicle.model');
const validators = require('../utils/validators');
const websocketManager = require('../utils/websocket');

class MaintenanceService {
  // Create a new maintenance record
  async createMaintenance({ vehicle_id, service_type, cost, service_date, description }) {
    // Validate required fields
    if (!vehicle_id || !service_type || cost === undefined || !service_date) {
      throw new Error('All maintenance fields are required');
    }

    // Validate cost is non-negative
    if (cost < 0) {
      throw new Error('Cost must be a non-negative number');
    }

    // Check if vehicle exists
    const vehicle = await vehicleModel.findById(vehicle_id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    // Sanitize inputs
    const sanitizedData = {
      vehicle_id,
      service_type: validators.sanitizeInput(service_type),
      cost,
      service_date,
      description: description ? validators.sanitizeInput(description) : null,
    };

    // Create maintenance record (this will also update vehicle status to "In Shop" in a transaction)
    const maintenance = await maintenanceModel.create(sanitizedData);
    
    // Broadcast WebSocket events
    websocketManager.broadcast('vehicle_status_changed', {
      vehicle_id,
      license_plate: vehicle.license_plate,
      old_status: vehicle.status,
      new_status: 'In Shop',
      timestamp: new Date().toISOString(),
    });
    
    websocketManager.broadcast('maintenance_alert', {
      vehicle_id,
      license_plate: vehicle.license_plate,
      message: `Maintenance scheduled: ${service_type}`,
      timestamp: new Date().toISOString(),
    });
    
    websocketManager.broadcast('kpi_update', {
      type: 'maintenance_created',
      timestamp: new Date().toISOString(),
    });
    
    return maintenance;
  }

  // Get all maintenance records with pagination and filters
  async getAllMaintenance({ page = 1, limit = 50, vehicle_id = null, status = null }) {
    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));

    // Validate status if provided
    const validStatuses = ['Scheduled', 'In Progress', 'Completed'];
    if (status && !validStatuses.includes(status)) {
      throw new Error('Invalid maintenance status');
    }

    const result = await maintenanceModel.findAll({
      page: pageNum,
      limit: limitNum,
      vehicle_id: vehicle_id ? parseInt(vehicle_id) : null,
      status,
    });

    return {
      maintenance: result.maintenance,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: result.total,
        pages: Math.ceil(result.total / limitNum),
      },
    };
  }

  // Get maintenance by ID
  async getMaintenanceById(id) {
    const maintenance = await maintenanceModel.findById(id);
    if (!maintenance) {
      throw new Error('Maintenance record not found');
    }
    return maintenance;
  }

  // Complete a maintenance record
  async completeMaintenance(id) {
    // Check if maintenance exists
    const maintenance = await maintenanceModel.findById(id);
    if (!maintenance) {
      throw new Error('Maintenance record not found');
    }

    // Check if already completed
    if (maintenance.status === 'Completed') {
      throw new Error('Maintenance is already completed');
    }

    // Get vehicle details before completing
    const vehicle = await vehicleModel.findById(maintenance.vehicle_id);

    // Complete maintenance (this will also update vehicle status to "Available" in a transaction)
    const completedMaintenance = await maintenanceModel.complete(id);
    
    // Broadcast WebSocket events
    websocketManager.broadcast('vehicle_status_changed', {
      vehicle_id: maintenance.vehicle_id,
      license_plate: vehicle.license_plate,
      old_status: 'In Shop',
      new_status: 'Available',
      timestamp: new Date().toISOString(),
    });
    
    websocketManager.broadcast('kpi_update', {
      type: 'maintenance_completed',
      timestamp: new Date().toISOString(),
    });
    
    return completedMaintenance;
  }
}

module.exports = new MaintenanceService();
