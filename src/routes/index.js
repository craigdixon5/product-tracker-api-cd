// src/routes/index.js - Main routes aggregator
const express = require('express');
const alertRoutes = require('./alerts');
const healthRoutes = require('./health');
const securityRoutes = require('./security');
const monitoringRoutes = require('./monitoring');

const router = express.Router();

// Mount route modules
router.use('/', healthRoutes);
router.use('/', securityRoutes);
router.use('/alerts', alertRoutes);
router.use('/', monitoringRoutes);

module.exports = router;
