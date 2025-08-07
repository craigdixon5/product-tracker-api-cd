// tests/setup.js - Test setup and configuration
const path = require('path');

// Set test environment
process.env.NODE_ENV = 'test';

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Set longer timeout for integration tests
jest.setTimeout(10000);
