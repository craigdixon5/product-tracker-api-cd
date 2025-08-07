// src/routes/monitoring.js - Monitoring routes
const express = require('express');
const AlertController = require('../controllers/AlertController');

const router = express.Router();
const alertController = new AlertController();

// POST /check-prices - Manual price checking for all alerts
router.post('/check-prices', (req, res) =>
  alertController.checkPrices(req, res)
);

module.exports = router;
