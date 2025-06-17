import { formatPrice, formatCurrency, formatRelativeTime, formatNumber } from '../formatting';

describe('Formatting Utilities', () => {
  describe('formatPrice', () => {
    it('formats USD prices correctly', () => {
      expect(formatPrice(29.99, 'USD')).toBe('$29.99');
      expect(formatPrice(100, 'USD')).toBe('$100.00');
      expect(formatPrice(0, 'USD')).toBe('$0.00');
    });

    it('formats EUR prices correctly', () => {
      expect(formatPrice(29.99, 'EUR')).toBe('€29.99');
      expect(formatPrice(100, 'EUR')).toBe('€100.00');
    });

    it('formats GBP prices correctly', () => {
      expect(formatPrice(29.99, 'GBP')).toBe('£29.99');
      expect(formatPrice(100, 'GBP')).toBe('£100.00');
    });

    it('handles large numbers correctly', () => {
      expect(formatPrice(1234.56, 'USD')).toBe('$1,234.56');
      expect(formatPrice(1000000, 'USD')).toBe('$1,000,000.00');
    });

    it('handles negative prices', () => {
      expect(formatPrice(-29.99, 'USD')).toBe('-$29.99');
    });

    it('rounds to 2 decimal places', () => {
      expect(formatPrice(29.999, 'USD')).toBe('$30.00');
      expect(formatPrice(29.991, 'USD')).toBe('$29.99');
    });
  });

  describe('formatCurrency', () => {
    it('returns correct currency symbol for known currencies', () => {
      expect(formatCurrency('USD')).toBe('$');
      expect(formatCurrency('EUR')).toBe('€');
      expect(formatCurrency('GBP')).toBe('£');
      expect(formatCurrency('JPY')).toBe('¥');
      expect(formatCurrency('CAD')).toBe('C$');
      expect(formatCurrency('AUD')).toBe('A$');
    });

    it('returns currency code for unknown currencies', () => {
      expect(formatCurrency('XYZ')).toBe('XYZ');
      expect(formatCurrency('UNKNOWN')).toBe('UNKNOWN');
    });

    it('handles lowercase currency codes', () => {
      expect(formatCurrency('usd')).toBe('$');
      expect(formatCurrency('eur')).toBe('€');
    });
  });

  describe('formatRelativeTime', () => {
    const now = new Date('2024-01-01T12:00:00Z');

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(now);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('formats times from the past correctly', () => {
      expect(formatRelativeTime(new Date('2024-01-01T11:59:30Z'))).toBe('30 seconds ago');
      expect(formatRelativeTime(new Date('2024-01-01T11:55:00Z'))).toBe('5 minutes ago');
      expect(formatRelativeTime(new Date('2024-01-01T10:00:00Z'))).toBe('2 hours ago');
      expect(formatRelativeTime(new Date('2023-12-31T12:00:00Z'))).toBe('1 day ago');
      expect(formatRelativeTime(new Date('2023-12-25T12:00:00Z'))).toBe('1 week ago');
      expect(formatRelativeTime(new Date('2023-11-01T12:00:00Z'))).toBe('2 months ago');
      expect(formatRelativeTime(new Date('2023-01-01T12:00:00Z'))).toBe('1 year ago');
    });

    it('formats times in the future correctly', () => {
      expect(formatRelativeTime(new Date('2024-01-01T12:00:30Z'))).toBe('in 30 seconds');
      expect(formatRelativeTime(new Date('2024-01-01T12:05:00Z'))).toBe('in 5 minutes');
      expect(formatRelativeTime(new Date('2024-01-01T14:00:00Z'))).toBe('in 2 hours');
      expect(formatRelativeTime(new Date('2024-01-02T12:00:00Z'))).toBe('in 1 day');
    });

    it('handles string dates', () => {
      expect(formatRelativeTime('2024-01-01T11:55:00Z')).toBe('5 minutes ago');
    });

    it('handles "just now" for very recent times', () => {
      expect(formatRelativeTime(new Date('2024-01-01T11:59:59Z'))).toBe('1 second ago');
      expect(formatRelativeTime(new Date('2024-01-01T12:00:01Z'))).toBe('in 1 second');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with default options', () => {
      expect(formatNumber(1234)).toBe('1,234');
      expect(formatNumber(1234567)).toBe('1,234,567');
      expect(formatNumber(0)).toBe('0');
    });

    it('formats numbers with decimal places', () => {
      expect(formatNumber(1234.56, { minimumFractionDigits: 2 })).toBe('1,234.56');
      expect(formatNumber(1234, { minimumFractionDigits: 2 })).toBe('1,234.00');
    });

    it('formats percentages', () => {
      expect(formatNumber(0.1234, { style: 'percent' })).toBe('12%');
      expect(formatNumber(0.1234, { style: 'percent', minimumFractionDigits: 1 })).toBe('12.3%');
    });

    it('formats with custom notation', () => {
      expect(formatNumber(1234567, { notation: 'compact' })).toBe('1.2M');
      expect(formatNumber(1234, { notation: 'compact' })).toBe('1.2K');
    });

    it('handles negative numbers', () => {
      expect(formatNumber(-1234)).toBe('-1,234');
      expect(formatNumber(-0.1234, { style: 'percent' })).toBe('-12%');
    });

    it('formats very large numbers', () => {
      expect(formatNumber(1000000000)).toBe('1,000,000,000');
      expect(formatNumber(1000000000, { notation: 'compact' })).toBe('1B');
    });

    it('formats very small numbers', () => {
      expect(formatNumber(0.001, { minimumFractionDigits: 3 })).toBe('0.001');
      expect(formatNumber(0.0001, { minimumFractionDigits: 4 })).toBe('0.0001');
    });
  });
});