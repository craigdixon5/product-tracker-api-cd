// server.js - Refactored Price Alert API with MVC structure
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Import middleware
const { csrfMiddleware } = require('./src/middleware/csrf');
const {
  notFoundHandler,
  errorHandler,
} = require('./src/middleware/errorHandler');

// Import routes
const routes = require('./src/routes');

// Import logger
const logger = require('./src/config/logger');

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// CSRF Protection middleware
app.use(csrfMiddleware);

// Mount all routes
app.use('/', routes);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Start server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info('Server started successfully'); // Hide port for security
    console.log('Simple Price Alert API is running');
    console.log('API Documentation: /api/docs');
    console.log('Health Check: /health');
  });
}

module.exports = app;
