import { describe, expect, it } from 'vitest';
import { parseCents } from './11-parse-cents';

describe('parseCents', () => {
  it.each([
    ['12', 1200],
    ['0.5', 50],
    ['7.05', 705],
    ['1.15', 115],
    ['4.35', 435],
    ['$1,234.56', 123456],
    [' 1.15 ', 115],
    ['0', 0],
  ])('parses %j as %i cents', (input, cents) => {
    expect(parseCents(input)).toBe(cents);
  });

  it.each(['', 'abc', '-5', '1.234', '1.2.3', '$', '12.', '.5'])('rejects %j', (input) => {
    expect(() => parseCents(input)).toThrow(`Invalid amount: ${input}`);
  });
});
