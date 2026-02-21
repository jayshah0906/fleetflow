// Maintenance routes
const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenance.controller');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');

// All routes require authentication
router.use(authenticateToken);

// GET /api/maintenance - List all maintenance records (all authenticated users)
router.get('/', maintenanceController.getAllMaintenance.bind(maintenanceController));

// GET /api/maintenance/:id - Get maintenance by ID (all authenticated users)
router.get('/:id', maintenanceController.getMaintenanceById.bind(maintenanceController));

// POST /api/maintenance - Create new maintenance record (Fleet Manager)
router.post(
  '/',
  checkRole('Fleet Manager'),
  maintenanceController.createMaintenance.bind(maintenanceController)
);

// PUT /api/maintenance/:id/complete - Complete maintenance (Fleet Manager)
router.put(
  '/:id/complete',
  checkRole('Fleet Manager'),
  maintenanceController.completeMaintenance.bind(maintenanceController)
);

module.exports = router;
