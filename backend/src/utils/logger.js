// Structured logging utility
const logger = {
  info: (message, meta = {}) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    }));
  },
  
  error: (message, meta = {}) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    }));
  },
  
  warn: (message, meta = {}) => {
    console.warn(JSON.stringify({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    }));
  },
  
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(JSON.stringify({
        level: 'debug',
        message,
        timestamp: new Date().toISOString(),
        ...meta,
      }));
    }
  },
  
  // Specialized logging methods for specific events
  
  // Log authentication attempts (Requirement 15.1)
  logAuth: (username, success, meta = {}) => {
    logger.info('Authentication attempt', {
      event: 'auth_attempt',
      username,
      success,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  },
  
  // Log database errors (Requirement 15.2)
  logDatabaseError: (query, error, meta = {}) => {
    logger.error('Database error', {
      event: 'database_error',
      query: query?.substring(0, 200), // Truncate long queries
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  },
  
  // Log validation failures (Requirement 15.3)
  logValidation: (endpoint, errors, meta = {}) => {
    logger.warn('Validation failure', {
      event: 'validation_failure',
      endpoint,
      errors,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  },
  
  // Log with request ID for tracing (Requirement 15.6)
  logRequest: (requestId, message, meta = {}) => {
    logger.info(message, {
      request_id: requestId,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  },
};

module.exports = logger;
