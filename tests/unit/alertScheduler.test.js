// tests/unit/alertScheduler.test.js - Unit tests for alert scheduler
const { shouldCheckAlert } = require('../../src/utils/alertScheduler');

describe('AlertScheduler Utility', () => {
  describe('shouldCheckAlert', () => {
    it('should return true for first check (no lastChecked)', () => {
      const alert = { frequency: 'daily' };
      expect(shouldCheckAlert(alert)).toBe(true);
    });

    it('should handle hourly frequency', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

      const alertReadyForCheck = {
        frequency: 'hourly',
        lastChecked: oneHourAgo.toISOString(),
      };
      const alertNotReady = {
        frequency: 'hourly',
        lastChecked: thirtyMinutesAgo.toISOString(),
      };

      expect(shouldCheckAlert(alertReadyForCheck)).toBe(true);
      expect(shouldCheckAlert(alertNotReady)).toBe(false);
    });

    it('should handle daily frequency', () => {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

      const alertReadyForCheck = {
        frequency: 'daily',
        lastChecked: oneDayAgo.toISOString(),
      };
      const alertNotReady = {
        frequency: 'daily',
        lastChecked: twelveHoursAgo.toISOString(),
      };

      expect(shouldCheckAlert(alertReadyForCheck)).toBe(true);
      expect(shouldCheckAlert(alertNotReady)).toBe(false);
    });

    it('should handle weekly frequency', () => {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

      const alertReadyForCheck = {
        frequency: 'weekly',
        lastChecked: oneWeekAgo.toISOString(),
      };
      const alertNotReady = {
        frequency: 'weekly',
        lastChecked: threeDaysAgo.toISOString(),
      };

      expect(shouldCheckAlert(alertReadyForCheck)).toBe(true);
      expect(shouldCheckAlert(alertNotReady)).toBe(false);
    });

    it('should default to true for unknown frequency', () => {
      const alert = {
        frequency: 'unknown',
        lastChecked: new Date().toISOString(),
      };
      expect(shouldCheckAlert(alert)).toBe(true);
    });
  });
});
