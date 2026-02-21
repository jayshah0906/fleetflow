// Trip routes
const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');

// All routes require authentication
router.use(authenticateToken);

// GET /api/trips - List all trips (all authenticated users)
router.get('/', tripController.getAllTrips.bind(tripController));

// GET /api/trips/:id - Get trip by ID (all authenticated users)
router.get('/:id', tripController.getTripById.bind(tripController));

// POST /api/trips - Create new trip (Dispatcher, Fleet Manager)
router.post(
  '/',
  checkRole('Dispatcher', 'Fleet Manager'),
  tripController.createTrip.bind(tripController)
);

// PUT /api/trips/:id/complete - Complete a trip (Dispatcher, Fleet Manager)
router.put(
  '/:id/complete',
  checkRole('Dispatcher', 'Fleet Manager'),
  tripController.completeTrip.bind(tripController)
);

// DELETE /api/trips/:id - Cancel a trip (Dispatcher, Fleet Manager)
router.delete(
  '/:id',
  checkRole('Dispatcher', 'Fleet Manager'),
  tripController.cancelTrip.bind(tripController)
);

module.exports = router;
