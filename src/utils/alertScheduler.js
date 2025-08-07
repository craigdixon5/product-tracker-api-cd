// src/utils/alertScheduler.js - Alert scheduling utility
/**
 * Helper function to check if it's time to check an alert based on frequency
 * @param {Object} alert - Alert object with lastChecked and frequency properties
 * @returns {boolean} - Whether the alert should be checked
 */
function shouldCheckAlert(alert) {
  if (!alert.lastChecked) {
    return true; // First check
  }

  const now = new Date();
  const timeSinceLastCheck =
    now.getTime() - new Date(alert.lastChecked).getTime();

  switch (alert.frequency) {
    case 'hourly':
      return timeSinceLastCheck >= 60 * 60 * 1000; // 1 hour
    case 'daily':
      return timeSinceLastCheck >= 24 * 60 * 60 * 1000; // 24 hours
    case 'weekly':
      return timeSinceLastCheck >= 7 * 24 * 60 * 60 * 1000; // 7 days
    default:
      return true;
  }
}

module.exports = { shouldCheckAlert };
