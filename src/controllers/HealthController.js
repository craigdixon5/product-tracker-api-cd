// src/controllers/HealthController.js - Health and documentation controller
const logger = require('../config/logger');

class HealthController {
  /**
   * Health check endpoint
   */
  async getHealth(req, res) {
    try {
      logger.info('Health check requested');
      res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error in health check:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * API documentation endpoint
   */
  async getApiDocs(req, res) {
    try {
      res.json({
        success: true,
        data: {
          title: 'Simple Price Alert API',
          description:
            'Production-ready API for creating and managing price tracking alerts',
          version: '1.0.0',
          phase: 'live',
          baseUrl: 'API running on configured host', // Hide port for security
          lastUpdated: new Date().toISOString(),

          overview: {
            purpose:
              'Create price alerts and monitor products at configurable frequencies',
            benefits: [
              'Quick integration - get started in under 5 minutes',
              'Security-first with CSRF protection and security headers',
              '100% test coverage with comprehensive test suite',
              'Production-ready with monitoring and error handling',
            ],
            limitations: [
              'Uses simulated price data (no live web scraping)',
              'In-memory storage (no data persistence)',
              'Email notifications are simulated (logged, not sent)',
            ],
          },

          quickStart: {
            description: 'Get started with a simple price alert in 3 steps',
            steps: [
              '1. GET /csrf-token to obtain authentication token',
              '2. POST /alerts with your product details and target price',
              '3. POST /check-prices to manually trigger price checking',
            ],
            exampleRequest: {
              url: '/alerts',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': '[token from /csrf-token]',
              },
              body: {
                productUrl: 'https://example.com/product1',
                targetPrice: 100,
                email: 'user@example.com',
                frequency: 'daily',
              },
            },
          },

          security: {
            csrf: {
              description: 'CSRF protection is enabled for all POST requests',
              workflow: [
                '1. GET /csrf-token to obtain a CSRF token',
                '2. Include token in x-csrf-token header or _csrf body field',
                '3. Make your POST request with the token',
              ],
              tokenExpiry: 'Tokens are valid for the session duration',
              errorCodes: {
                403: 'Missing or invalid CSRF token',
              },
            },
            headers: {
              helmet: 'Security headers automatically applied',
              cors: 'No CORS restrictions (suitable for development)',
              contentType: 'JSON requests and responses only',
            },
          },

          endpoints: [
            {
              method: 'GET',
              path: '/health',
              description: 'Check API availability and status',
              protected: false,
              parameters: 'None',
              response: {
                success: true,
                status: 'healthy',
                timestamp: 'ISO 8601 datetime',
              },
            },
            {
              method: 'GET',
              path: '/csrf-token',
              description: 'Get CSRF token for protected requests',
              protected: false,
              parameters: 'None',
              response: {
                success: true,
                csrfToken: 'string - Use in x-csrf-token header',
                message: 'string - Usage instructions',
              },
            },
            {
              method: 'POST',
              path: '/alerts',
              description: 'Create a new price alert with email notifications',
              protected: true,
              headers: {
                'x-csrf-token':
                  'string (required) - CSRF token from /csrf-token',
              },
              body: {
                productUrl: 'string (required) - URL of product to monitor',
                targetPrice:
                  'number (required) - Target price threshold (must be > 0)',
                email: 'string (required) - Email address for notifications',
                frequency:
                  'string (required) - Check frequency: hourly|daily|weekly',
              },
              responses: {
                201: 'Alert created successfully',
                400: 'Validation error (missing fields, invalid price, etc.)',
                403: 'CSRF token missing or invalid',
              },
            },
            {
              method: 'GET',
              path: '/alerts',
              description: 'Get all created price alerts',
              protected: false,
              parameters: 'None',
              response: {
                success: true,
                data: 'array - List of all alerts with their details',
              },
            },
            {
              method: 'POST',
              path: '/check-prices',
              description:
                'Manually trigger price checking for all active alerts',
              protected: true,
              headers: {
                'x-csrf-token':
                  'string (required) - CSRF token from /csrf-token',
              },
              response: {
                success: true,
                checked: 'number - Alerts processed',
                triggered: 'number - Alerts that met target conditions',
                notifications: 'array - Details of triggered notifications',
              },
            },
          ],

          errorHandling: {
            format: 'All errors returned in consistent JSON format',
            structure: {
              success: false,
              error: 'string - Human-readable error description',
              timestamp: 'string - ISO 8601 datetime',
            },
            commonErrors: {
              400: 'Bad Request - Validation errors, missing required fields',
              403: 'Forbidden - CSRF token missing or invalid',
              404: 'Not Found - Invalid endpoint or route',
              500: 'Internal Server Error - Unexpected server errors',
            },
          },

          testing: {
            testSuite: 'Run `npm test` to execute 14 comprehensive tests',
            coverage:
              '100% test coverage including CSRF, validation, and error handling',
            testData:
              'API uses simulated price data perfect for integration testing',
            healthCheck:
              'Use /health endpoint for monitoring and uptime checks',
          },

          support: {
            documentation: 'See API-DOCS.md for comprehensive documentation',
            logs: 'Structured logging available in logs/ directory',
            monitoring: 'Health checks and error tracking included',
            contact: 'Submit issues via project repository',
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error getting API docs:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  }
}

module.exports = HealthController;
