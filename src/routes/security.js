// src/routes/security.js - Security routes
const express = require('express');
const SecurityController = require('../controllers/SecurityController');

const router = express.Router();
const securityController = new SecurityController();

// GET /csrf-token - Get CSRF token for protected requests
router.get('/csrf-token', (req, res) =>
  securityController.getCsrfToken(req, res)
);

module.exports = router;
