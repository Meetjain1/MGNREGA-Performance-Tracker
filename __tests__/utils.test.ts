import { calculateDistance, findNearestDistrict, formatLargeNumber, formatIndianNumber, getFinancialYear } from '@/lib/utils';

describe('Utils', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two coordinates', () => {
      // Distance between Lucknow and Kanpur (approx 80 km)
      const distance = calculateDistance(26.8467, 80.9462, 26.4499, 80.3319);
      expect(distance).toBeGreaterThan(70);
      expect(distance).toBeLessThan(90);
    });

    it('should return 0 for same coordinates', () => {
      const distance = calculateDistance(26.8467, 80.9462, 26.8467, 80.9462);
      expect(distance).toBeLessThan(0.001);
    });
  });

  describe('findNearestDistrict', () => {
    const districts = [
      { id: '1', code: 'LKO', name: 'Lucknow', nameHindi: null, latitude: 26.8467, longitude: 80.9462 },
      { id: '2', code: 'KNP', name: 'Kanpur', nameHindi: null, latitude: 26.4499, longitude: 80.3319 },
      { id: '3', code: 'VNS', name: 'Varanasi', nameHindi: null, latitude: 25.3176, longitude: 82.9739 },
    ];

    it('should find the nearest district', () => {
      // User location close to Lucknow
      const nearest = findNearestDistrict(26.85, 80.95, districts);
      expect(nearest).toBeDefined();
      expect(nearest?.name).toBe('Lucknow');
    });

    it('should return null for empty districts array', () => {
      const nearest = findNearestDistrict(26.85, 80.95, []);
      expect(nearest).toBeNull();
    });
  });

  describe('formatLargeNumber', () => {
    it('should format numbers in Crores', () => {
      const result = formatLargeNumber(15000000);
      expect(result).toContain('1.50');
      expect(result).toContain('Cr');
    });

    it('should format numbers in Lakhs', () => {
      const result = formatLargeNumber(500000);
      expect(result).toContain('5.00');
      expect(result).toContain('L');
    });

    it('should format numbers in Thousands', () => {
      const result = formatLargeNumber(5000);
      expect(result).toContain('5.00');
      expect(result).toContain('K');
    });

    it('should handle BigInt', () => {
      const result = formatLargeNumber(BigInt(15000000));
      expect(result).toContain('Cr');
    });
  });

  describe('formatIndianNumber', () => {
    it('should format numbers with Indian comma style', () => {
      expect(formatIndianNumber(1234567)).toBe('12,34,567');
      expect(formatIndianNumber(123456)).toBe('1,23,456');
      expect(formatIndianNumber(12345)).toBe('12,345');
      expect(formatIndianNumber(123)).toBe('123');
    });

    it('should handle BigInt', () => {
      expect(formatIndianNumber(BigInt(1234567))).toBe('12,34,567');
    });
  });

  describe('getFinancialYear', () => {
    it('should return correct financial year for April onwards', () => {
      const date = new Date('2024-04-01');
      expect(getFinancialYear(date)).toBe('2024-25');
    });

    it('should return correct financial year before April', () => {
      const date = new Date('2024-03-31');
      expect(getFinancialYear(date)).toBe('2023-24');
    });

    it('should handle current date', () => {
      const fy = getFinancialYear();
      expect(fy).toMatch(/^\d{4}-\d{2}$/);
    });
  });
});
