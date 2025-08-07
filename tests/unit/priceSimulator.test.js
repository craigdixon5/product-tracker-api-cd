// tests/unit/priceSimulator.test.js - Unit tests for price simulator
const { simulatePrice } = require('../../src/utils/priceSimulator');

describe('PriceSimulator Utility', () => {
  describe('simulatePrice', () => {
    it('should return a price within the expected range', () => {
      for (let i = 0; i < 100; i++) {
        const price = simulatePrice();
        expect(price).toBeGreaterThanOrEqual(30);
        expect(price).toBeLessThanOrEqual(180);
        expect(Number.isInteger(price)).toBe(true);
      }
    });

    it('should return different prices on multiple calls', () => {
      const prices = [];
      for (let i = 0; i < 10; i++) {
        prices.push(simulatePrice());
      }
      // It's highly unlikely all 10 prices would be the same
      const uniquePrices = new Set(prices);
      expect(uniquePrices.size).toBeGreaterThan(1);
    });
  });
});
