// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    requestId: req.id,
  });

  // Database errors
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      error: 'Duplicate entry',
      details: err.detail,
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      error: 'Foreign key constraint violation',
      details: err.detail,
    });
  }

  if (err.code === '23514') {
    return res.status(400).json({
      success: false,
      error: 'Check constraint violation',
      details: err.detail,
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
};

module.exports = { errorHandler };
