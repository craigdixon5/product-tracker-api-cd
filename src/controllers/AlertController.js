// src/controllers/AlertController.js - Alert controller
const AlertService = require('../services/AlertService');
const logger = require('../config/logger');

class AlertController {
  constructor() {
    this.alertService = new AlertService();
  }

  /**
   * Create a new price alert
   */
  async createAlert(req, res) {
    try {
      const alertData = req.body;

      // Validate alert data
      const validation = this.alertService.validateAlert(alertData);
      if (!validation.isValid) {
        logger.warn('Invalid alert creation request', {
          error: validation.error,
          alertData: {
            productUrl: !!alertData.productUrl,
            targetPrice: !!alertData.targetPrice,
            email: !!alertData.email,
            frequency: !!alertData.frequency,
          },
        });
        return res.status(400).json({
          success: false,
          error: validation.error,
          timestamp: new Date().toISOString(),
        });
      }

      // Create alert
      const alert = this.alertService.createAlert(alertData);

      res.status(201).json({
        success: true,
        data: alert,
        message: `Price alert has been set! You will be notified when the product price meets or drops below £${alert.targetPrice}. Price checks will run ${alert.frequency}.`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error creating alert:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get all alerts
   */
  async getAllAlerts(req, res) {
    try {
      const alerts = this.alertService.getAllAlerts();
      res.json({
        success: true,
        data: alerts,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error getting alerts:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get alerts for specific user
   */
  async getUserAlerts(req, res) {
    try {
      const { userId } = req.params;
      const userAlerts = this.alertService.getUserAlerts(userId);

      res.json({
        success: true,
        data: userAlerts,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error getting user alerts:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Check prices for all alerts
   */
  async checkPrices(req, res) {
    try {
      const result = this.alertService.checkPrices();

      res.json({
        success: true,
        checked: result.checked,
        triggered: result.triggered,
        notifications: result.notifications,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error checking prices:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  }
}

module.exports = AlertController;
