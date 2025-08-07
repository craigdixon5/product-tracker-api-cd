// src/routes/health.js - Health and documentation routes
const express = require('express');
const HealthController = require('../controllers/HealthController');

const router = express.Router();
const healthController = new HealthController();

// GET /health - Health check
router.get('/health', (req, res) => healthController.getHealth(req, res));

// GET /api/docs - API Documentation
router.get('/api/docs', (req, res) => healthController.getApiDocs(req, res));

module.exports = router;
