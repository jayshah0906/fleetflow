// Global error handling middleware
const logger = require('../utils/logger');

// Custom error class for operational errors
class AppError extends Error {
  constructor(message, statusCode, code, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  // Log error with request context
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    requestId: req.id,
    url: req.url,
    method: req.method,
    userId: req.user?.id,
  });

  // Operational errors (expected)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  // Database errors
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_RESOURCE',
        message: 'Duplicate entry',
        details: { constraint: err.constraint, detail: err.detail },
      },
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'FOREIGN_KEY_VIOLATION',
        message: 'Foreign key constraint violation',
        details: { constraint: err.constraint, detail: err.detail },
      },
    });
  }

  if (err.code === '23514') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'CHECK_CONSTRAINT_VIOLATION',
        message: 'Check constraint violation',
        details: { constraint: err.constraint, detail: err.detail },
      },
    });
  }

  if (err.code === '23502') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'NOT_NULL_VIOLATION',
        message: 'Required field is missing',
        details: { column: err.column, detail: err.detail },
      },
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      },
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Authentication token has expired',
      },
    });
  }

  // Programming errors (unexpected)
  // Don't leak error details to client
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      requestId: req.id,
    },
  });
};

module.exports = { errorHandler, AppError };
