// tests/unit/emailMask.test.js - Unit tests for email masking utility
const { maskEmail } = require('../../src/utils/emailMask');

describe('EmailMask Utility', () => {
  describe('maskEmail', () => {
    it('should mask email addresses correctly', () => {
      expect(maskEmail('user@example.com')).toBe('us**@example.com');
      expect(maskEmail('a@example.com')).toBe('a*@example.com');
      expect(maskEmail('ab@example.com')).toBe('a*@example.com'); // 2 chars gets 1+*
      expect(maskEmail('john.doe@company.org')).toBe('jo******@company.org');
    });

    it('should handle invalid emails', () => {
      expect(maskEmail('')).toBe('[invalid-email]');
      expect(maskEmail(null)).toBe('[invalid-email]');
      expect(maskEmail(undefined)).toBe('[invalid-email]');
      expect(maskEmail('invalid-email')).toBe('[invalid-email]');
      expect(maskEmail('@example.com')).toBe('[invalid-email]');
      expect(maskEmail('user@')).toBe('[invalid-email]');
    });

    it('should handle non-string inputs', () => {
      expect(maskEmail(123)).toBe('[invalid-email]');
      expect(maskEmail({})).toBe('[invalid-email]');
      expect(maskEmail([])).toBe('[invalid-email]');
    });
  });
});
