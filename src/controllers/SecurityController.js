// src/controllers/SecurityController.js - Security and CSRF controller
const { csrfProtection } = require('../middleware/csrf');
const logger = require('../config/logger');

class SecurityController {
  /**
   * Get CSRF token for protected requests
   */
  async getCsrfToken(req, res) {
    try {
      const secret = req.cookies._csrf || csrfProtection.secretSync();
      const token = csrfProtection.create(secret);

      res.cookie('_csrf', secret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      logger.info('CSRF token generated', { ip: req.ip });

      res.json({
        success: true,
        csrfToken: token,
        message:
          'Include this token in x-csrf-token header or _csrf body field for protected requests',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error generating CSRF token:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  }
}

module.exports = SecurityController;
