// src/test/time.test.ts
import { describe, it, expect } from 'vitest';
import { formatTime, formatDate, getDayName, isToday } from '../utils/time';

describe('Time utilities', () => {
  it('formats seconds into m:ss format', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(600)).toBe('10:00');
  });

  it('formats date strings', () => {
    const formatted = formatDate('2024-05-15T00:00:00Z');
    expect(formatted).toContain('2024');
  });

  it('gets short day names', () => {
    const day = getDayName('2024-05-15');
    expect(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).toContain(day);
  });

  it('checks if date is today', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(isToday(today)).toBe(true);
    expect(isToday('2020-01-01')).toBe(false);
  });
});
