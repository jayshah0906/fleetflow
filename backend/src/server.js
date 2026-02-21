// Fleet Management System - Main Server Entry Point
const express = require('express');
const cors = require('cors');
const { validateEnv, config } = require('./config/env');
const { errorHandler } = require('./middleware/errorHandler');
const { limiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');
const websocketManager = require('./utils/websocket');

// Validate environment variables
validateEnv();

const app = express();

// Middleware
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Request logging
app.use((req, res, next) => {
  req.id = Math.random().toString(36).substring(7);
  logger.info('Incoming request', {
    requestId: req.id,
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes (to be implemented)
// app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/vehicles', require('./routes/vehicle.routes'));
// app.use('/api/drivers', require('./routes/driver.routes'));
// app.use('/api/trips', require('./routes/trip.routes'));
// app.use('/api/maintenance', require('./routes/maintenance.routes'));
// app.use('/api/expenses', require('./routes/expense.routes'));
// app.use('/api/dashboard', require('./routes/dashboard.routes'));
// app.use('/api/reports', require('./routes/report.routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.server.port;
const server = app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`, {
    environment: config.server.nodeEnv,
    port: PORT,
  });
});

// Initialize WebSocket server
websocketManager.initialize(server);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
