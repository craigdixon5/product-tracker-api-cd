// src/services/AlertService.js - Alert management service
const { maskEmail } = require('../utils/emailMask');
const { shouldCheckAlert } = require('../utils/alertScheduler');
const { simulatePrice } = require('../utils/priceSimulator');
const logger = require('../config/logger');

class AlertService {
  constructor() {
    // In-memory storage (for simplicity)
    this.alerts = [];
  }

  /**
   * Create a new price alert
   * @param {Object} alertData - Alert data
   * @returns {Object} - Created alert
   */
  createAlert(alertData) {
    const { productUrl, targetPrice, email, frequency } = alertData;

    const alert = {
      id: Date.now().toString(),
      productUrl,
      targetPrice: Number(targetPrice),
      email,
      frequency,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastChecked: null,
    };

    this.alerts.push(alert);

    logger.info('Price alert created', {
      alertId: alert.id,
      productUrl,
      targetPrice,
      email: maskEmail(email), // Mask PII in logs
      frequency,
    });

    return alert;
  }

  /**
   * Get all alerts
   * @returns {Array} - All alerts with masked emails
   */
  getAllAlerts() {
    return this.alerts.map(alert => ({
      ...alert,
      email: maskEmail(alert.email),
    }));
  }

  /**
   * Get alerts for specific user
   * @param {string} userId - User ID
   * @returns {Array} - User alerts with masked emails
   */
  getUserAlerts(userId) {
    const userAlerts = this.alerts.filter(alert => alert.userId === userId);
    return userAlerts.map(alert => ({
      ...alert,
      email: maskEmail(alert.email),
    }));
  }

  /**
   * Check prices for all active alerts
   * @returns {Object} - Check results
   */
  checkPrices() {
    logger.info('Manual price check initiated');
    const notifications = [];
    let checkedCount = 0;

    this.alerts.forEach(alert => {
      if (!alert.isActive) {
        return;
      }

      // Check if it's time to check this alert
      if (!shouldCheckAlert(alert)) {
        return;
      }

      checkedCount++;

      // Simulate price checking
      const currentPrice = simulatePrice();

      // Update last checked time
      alert.lastChecked = new Date().toISOString();

      // Check if price meets target condition (price dropped to or below target)
      if (currentPrice <= alert.targetPrice) {
        const notification = {
          alertId: alert.id,
          email: maskEmail(alert.email), // Mask PII in API response
          productUrl: alert.productUrl,
          currentPrice,
          targetPrice: alert.targetPrice,
          message: `Great news! Price dropped to £${currentPrice}! Your target was £${alert.targetPrice}`,
          timestamp: new Date().toISOString(),
        };

        notifications.push(notification);
        logger.info('Email notification sent', {
          email: maskEmail(alert.email), // Mask PII in logs
          productUrl: alert.productUrl,
          currentPrice,
          targetPrice: alert.targetPrice,
          message: notification.message,
        });

        // Keep console output for demo/testing visibility (with masked email)
        console.log(`EMAIL NOTIFICATION to ${maskEmail(alert.email)}:`);
        console.log(`   Product: ${alert.productUrl}`);
        console.log(
          `   Price dropped to £${currentPrice} (target: £${alert.targetPrice})`
        );
        console.log(`   Message: ${notification.message}`);
      }
    });

    return {
      checked: checkedCount,
      triggered: notifications.length,
      notifications,
    };
  }

  /**
   * Validate alert data
   * @param {Object} alertData - Alert data to validate
   * @returns {Object} - Validation result
   */
  validateAlert(alertData) {
    const { productUrl, targetPrice, email, frequency } = alertData;

    if (!productUrl || !targetPrice || !email || !frequency) {
      return {
        isValid: false,
        error:
          'Missing required fields: productUrl, targetPrice, email, frequency',
      };
    }

    if (targetPrice <= 0) {
      return {
        isValid: false,
        error: 'Target price must be greater than 0',
      };
    }

    if (!['hourly', 'daily', 'weekly'].includes(frequency)) {
      return {
        isValid: false,
        error: 'Check frequency must be hourly, daily, or weekly',
      };
    }

    return { isValid: true };
  }
}

module.exports = AlertService;
