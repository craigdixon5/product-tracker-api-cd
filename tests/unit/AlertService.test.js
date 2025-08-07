// tests/unit/AlertService.test.js - Unit tests for AlertService
const AlertService = require('../../src/services/AlertService');

describe('AlertService', () => {
  let alertService;

  beforeEach(() => {
    alertService = new AlertService();
  });

  describe('validateAlert', () => {
    it('should validate correct alert data', () => {
      const alertData = {
        productUrl: 'https://example.com/product',
        targetPrice: 100,
        email: 'user@example.com',
        frequency: 'daily',
      };

      const result = alertService.validateAlert(alertData);
      expect(result.isValid).toBe(true);
    });

    it('should reject missing fields', () => {
      const alertData = {
        productUrl: 'https://example.com/product',
        // missing targetPrice, email, frequency
      };

      const result = alertService.validateAlert(alertData);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Missing required fields');
    });

    it('should reject invalid target price', () => {
      const alertData = {
        productUrl: 'https://example.com/product',
        targetPrice: -10,
        email: 'user@example.com',
        frequency: 'daily',
      };

      const result = alertService.validateAlert(alertData);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Target price must be greater than 0');
    });

    it('should reject invalid frequency', () => {
      const alertData = {
        productUrl: 'https://example.com/product',
        targetPrice: 100,
        email: 'user@example.com',
        frequency: 'invalid',
      };

      const result = alertService.validateAlert(alertData);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain(
        'Check frequency must be hourly, daily, or weekly'
      );
    });
  });

  describe('createAlert', () => {
    it('should create alert successfully', () => {
      const alertData = {
        productUrl: 'https://example.com/product',
        targetPrice: 100,
        email: 'user@example.com',
        frequency: 'daily',
      };

      const alert = alertService.createAlert(alertData);

      expect(alert.id).toBeDefined();
      expect(alert.productUrl).toBe(alertData.productUrl);
      expect(alert.targetPrice).toBe(alertData.targetPrice);
      expect(alert.email).toBe(alertData.email);
      expect(alert.frequency).toBe(alertData.frequency);
      expect(alert.isActive).toBe(true);
      expect(alert.createdAt).toBeDefined();
      expect(alert.lastChecked).toBe(null);
    });
  });

  describe('getAllAlerts', () => {
    it('should return all alerts with masked emails', () => {
      const alertData = {
        productUrl: 'https://example.com/product',
        targetPrice: 100,
        email: 'user@example.com',
        frequency: 'daily',
      };

      alertService.createAlert(alertData);
      const alerts = alertService.getAllAlerts();

      expect(alerts).toHaveLength(1);
      expect(alerts[0].email).toBe('us**@example.com');
    });
  });

  describe('getUserAlerts', () => {
    it('should return user alerts with masked emails', () => {
      const alertData = {
        productUrl: 'https://example.com/product',
        targetPrice: 100,
        email: 'user@example.com',
        frequency: 'daily',
        userId: 'user123',
      };

      // Create alert and manually set userId for testing
      alertService.createAlert(alertData);
      alertService.alerts[0].userId = 'user123';

      const userAlerts = alertService.getUserAlerts('user123');
      expect(userAlerts).toHaveLength(1);
      expect(userAlerts[0].email).toBe('us**@example.com');

      const otherUserAlerts = alertService.getUserAlerts('user456');
      expect(otherUserAlerts).toHaveLength(0);
    });
  });
});
