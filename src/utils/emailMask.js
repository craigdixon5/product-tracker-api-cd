// src/utils/emailMask.js - PII protection utility
/**
 * Helper function to mask email addresses for logging (PII protection)
 * @param {string} email - Email address to mask
 * @returns {string} - Masked email address
 */
function maskEmail(email) {
  if (!email || typeof email !== 'string') {
    return '[invalid-email]';
  }
  const [username, domain] = email.split('@');
  if (!username || !domain) {
    return '[invalid-email]';
  }

  const maskedUsername =
    username.length > 2
      ? username.substring(0, 2) + '*'.repeat(username.length - 2)
      : username.substring(0, 1) + '*';

  return `${maskedUsername}@${domain}`;
}

module.exports = { maskEmail };
