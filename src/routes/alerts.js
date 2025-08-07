// src/routes/alerts.js - Alert routes
const express = require('express');
const AlertController = require('../controllers/AlertController');

const router = express.Router();
const alertController = new AlertController();

// POST /alerts - Create a new price alert
router.post('/', (req, res) => alertController.createAlert(req, res));

// GET /alerts - Get all alerts
router.get('/', (req, res) => alertController.getAllAlerts(req, res));

// GET /alerts/:userId - Get alerts for specific user
router.get('/:userId', (req, res) => alertController.getUserAlerts(req, res));

module.exports = router;
