// src/middleware/csrf.js - CSRF protection middleware
const csrf = require('csrf');
const logger = require('../config/logger');

const csrfProtection = new csrf();

/**
 * CSRF Protection middleware
 */
function csrfMiddleware(req, res, next) {
  // Skip CSRF for GET requests and health/docs endpoints
  if (
    req.method === 'GET' ||
    req.path === '/health' ||
    req.path === '/api/docs' ||
    req.path === '/csrf-token'
  ) {
    return next();
  }

  const secret = req.cookies._csrf || csrfProtection.secretSync();
  const token = req.headers['x-csrf-token'] || req.body._csrf;

  if (!token) {
    logger.warn('CSRF token missing', {
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
    return res.status(403).json({
      success: false,
      error: 'CSRF token missing. Get token from /csrf-token endpoint.',
      timestamp: new Date().toISOString(),
    });
  }

  if (!csrfProtection.verify(secret, token)) {
    logger.warn('Invalid CSRF token', {
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
    return res.status(403).json({
      success: false,
      error: 'Invalid CSRF token',
      timestamp: new Date().toISOString(),
    });
  }

  // Set the secret in cookie for future requests
  res.cookie('_csrf', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  next();
}

module.exports = { csrfMiddleware, csrfProtection };
