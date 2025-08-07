// src/middleware/errorHandler.js - Error handling middleware
const logger = require('../config/logger');

/**
 * 404 handler for undefined routes
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Global error handler
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString(),
  });
}

module.exports = { notFoundHandler, errorHandler };
