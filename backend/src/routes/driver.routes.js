// Driver routes
const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver.controller');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');

// All routes require authentication
router.use(authenticateToken);

// GET /api/drivers - List all drivers (all authenticated users)
router.get('/', driverController.getAllDrivers.bind(driverController));

// GET /api/drivers/:id - Get driver by ID (all authenticated users)
router.get('/:id', driverController.getDriverById.bind(driverController));

// POST /api/drivers - Create new driver (Fleet Manager, Safety Officer)
router.post(
  '/',
  checkRole('Fleet Manager', 'Safety Officer'),
  driverController.createDriver.bind(driverController)
);

// PUT /api/drivers/:id - Update driver (Fleet Manager, Safety Officer)
router.put(
  '/:id',
  checkRole('Fleet Manager', 'Safety Officer'),
  driverController.updateDriver.bind(driverController)
);

// DELETE /api/drivers/:id - Delete driver (Fleet Manager only)
router.delete(
  '/:id',
  checkRole('Fleet Manager'),
  driverController.deleteDriver.bind(driverController)
);

module.exports = router;
