// tests/integration/api.test.js - Integration tests for the API
const request = require('supertest');
const app = require('../../app');

// Helper function to get CSRF token
async function getCsrfToken() {
  const response = await request(app).get('/csrf-token');
  return {
    token: response.body.csrfToken,
    cookies: response.headers['set-cookie'],
  };
}

describe('Price Alert API Integration Tests', () => {
  // Note: Tests run independently, but alert state persists across tests
  // Health Check Tests
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.status).toBe('healthy');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  // API Documentation Tests
  describe('GET /api/docs', () => {
    it('should return API documentation', async () => {
      const response = await request(app).get('/api/docs').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Simple Price Alert API');
      expect(response.body.data.endpoints).toBeDefined();
      expect(Array.isArray(response.body.data.endpoints)).toBe(true);
      expect(response.body.data.security.csrf).toBeDefined();
    });
  });

  // CSRF Token Tests
  describe('GET /csrf-token', () => {
    it('should return CSRF token', async () => {
      const response = await request(app).get('/csrf-token').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.csrfToken).toBeDefined();
      expect(typeof response.body.csrfToken).toBe('string');
      expect(response.body.message).toContain('Include this token');
    });
  });

  // Alert Creation Tests
  describe('POST /alerts', () => {
    it('should create alert with valid data and CSRF token', async () => {
      const { token, cookies } = await getCsrfToken();

      const alertData = {
        productUrl: 'https://example.com/laptop',
        targetPrice: 800,
        email: 'user@example.com',
        frequency: 'daily',
      };

      const response = await request(app)
        .post('/alerts')
        .set('Cookie', cookies)
        .set('x-csrf-token', token)
        .send(alertData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.productUrl).toBe(alertData.productUrl);
      expect(response.body.data.targetPrice).toBe(alertData.targetPrice);
      expect(response.body.data.email).toBe(alertData.email);
      expect(response.body.data.frequency).toBe(alertData.frequency);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.isActive).toBe(true);
      expect(response.body.message).toContain('Price alert has been set');
    });

    it('should reject request without CSRF token', async () => {
      const alertData = {
        productUrl: 'https://example.com/laptop',
        targetPrice: 800,
        email: 'user@example.com',
        frequency: 'daily',
      };

      const response = await request(app)
        .post('/alerts')
        .send(alertData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('CSRF token missing');
    });

    it('should reject invalid alert data', async () => {
      const { token, cookies } = await getCsrfToken();

      const invalidAlertData = {
        productUrl: 'https://example.com/laptop',
        targetPrice: -100, // Invalid negative price
        email: 'user@example.com',
        frequency: 'daily',
      };

      const response = await request(app)
        .post('/alerts')
        .set('Cookie', cookies)
        .set('x-csrf-token', token)
        .send(invalidAlertData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain(
        'Target price must be greater than 0'
      );
    });

    it('should reject missing required fields', async () => {
      const { token, cookies } = await getCsrfToken();

      const incompleteAlertData = {
        productUrl: 'https://example.com/laptop',
        // Missing targetPrice, email, frequency
      };

      const response = await request(app)
        .post('/alerts')
        .set('Cookie', cookies)
        .set('x-csrf-token', token)
        .send(incompleteAlertData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Missing required fields');
    });

    it('should reject invalid frequency', async () => {
      const { token, cookies } = await getCsrfToken();

      const alertData = {
        productUrl: 'https://example.com/laptop',
        targetPrice: 800,
        email: 'user@example.com',
        frequency: 'invalid-frequency',
      };

      const response = await request(app)
        .post('/alerts')
        .set('Cookie', cookies)
        .set('x-csrf-token', token)
        .send(alertData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain(
        'Check frequency must be hourly, daily, or weekly'
      );
    });
  });

  // Get Alerts Tests
  describe('GET /alerts', () => {
    beforeEach(async () => {
      // Create a test alert before each test
      const { token, cookies } = await getCsrfToken();
      const alertData = {
        productUrl: 'https://example.com/product',
        targetPrice: 100,
        email: 'test@example.com',
        frequency: 'daily',
      };

      await request(app)
        .post('/alerts')
        .set('Cookie', cookies)
        .set('x-csrf-token', token)
        .send(alertData);
    });

    it('should return all alerts with masked emails', async () => {
      const response = await request(app).get('/alerts').expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);

      // Check that email is masked (may vary based on test execution order)
      const alert = response.body.data[0];
      expect(alert.email).toMatch(/^.{1,2}\*+@example\.com$/); // Flexible email mask pattern
      expect(alert.productUrl).toBeDefined();
      expect(alert.targetPrice).toBeDefined();
    });
  });

  // Price Check Tests
  describe('POST /check-prices', () => {
    beforeEach(async () => {
      // Create a test alert before price checking
      const { token, cookies } = await getCsrfToken();
      const alertData = {
        productUrl: 'https://example.com/product',
        targetPrice: 200, // High target to potentially trigger
        email: 'test@example.com',
        frequency: 'daily',
      };

      await request(app)
        .post('/alerts')
        .set('Cookie', cookies)
        .set('x-csrf-token', token)
        .send(alertData);
    });

    it('should check prices with valid CSRF token', async () => {
      const { token, cookies } = await getCsrfToken();

      const response = await request(app)
        .post('/check-prices')
        .set('Cookie', cookies)
        .set('x-csrf-token', token)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(typeof response.body.checked).toBe('number');
      expect(typeof response.body.triggered).toBe('number');
      expect(Array.isArray(response.body.notifications)).toBe(true);
    });

    it('should reject price check without CSRF token', async () => {
      const response = await request(app).post('/check-prices').expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('CSRF token missing');
    });
  });

  // 404 Error Tests
  describe('404 Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Route not found');
    });

    it('should return 403 for invalid POST routes due to CSRF protection', async () => {
      const response = await request(app).post('/invalid-route').expect(403); // POST routes hit CSRF protection first

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('CSRF token missing');
    });
  });
});
