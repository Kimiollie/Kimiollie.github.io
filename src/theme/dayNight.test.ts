import { describe, expect, it } from 'vitest';
import { isDayAt, themeAt } from './dayNight.ts';

const at = (hours: number, minutes: number) => new Date(2026, 10, 13, hours, minutes);

describe('isDayAt', () => {
  it('is night at 06:59', () => expect(isDayAt(at(6, 59))).toBe(false));
  it('is day at 07:00', () => expect(isDayAt(at(7, 0))).toBe(true));
  it('is day at 17:59', () => expect(isDayAt(at(17, 59))).toBe(true));
  it('is night at 18:00', () => expect(isDayAt(at(18, 0))).toBe(false));

  it('maps to a theme name', () => {
    expect(themeAt(at(12, 0))).toBe('day');
    expect(themeAt(at(0, 30))).toBe('night');
  });
});
