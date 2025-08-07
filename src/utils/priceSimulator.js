// src/utils/priceSimulator.js - Price simulation utility
/**
 * Helper function to simulate price checking
 * @returns {number} - Random price between 30-180
 */
function simulatePrice() {
  return Math.floor(Math.random() * 150) + 30; // Random price between 30-180
}

module.exports = { simulatePrice };
