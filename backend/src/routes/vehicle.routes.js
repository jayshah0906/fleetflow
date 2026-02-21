// Vehicle routes
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');

// All routes require authentication
router.use(authenticateToken);

// GET /api/vehicles - List all vehicles (all authenticated users)
router.get('/', vehicleController.getAllVehicles.bind(vehicleController));

// GET /api/vehicles/:id - Get vehicle by ID (all authenticated users)
router.get('/:id', vehicleController.getVehicleById.bind(vehicleController));

// POST /api/vehicles - Create new vehicle (Fleet Manager only)
router.post(
  '/',
  checkRole('Fleet Manager'),
  vehicleController.createVehicle.bind(vehicleController)
);

// PUT /api/vehicles/:id - Update vehicle (Fleet Manager only)
router.put(
  '/:id',
  checkRole('Fleet Manager'),
  vehicleController.updateVehicle.bind(vehicleController)
);

// DELETE /api/vehicles/:id - Delete vehicle (Fleet Manager only)
router.delete(
  '/:id',
  checkRole('Fleet Manager'),
  vehicleController.deleteVehicle.bind(vehicleController)
);

module.exports = router;
