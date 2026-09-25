import { describe, expect, it } from 'vitest';
import { splitBill } from './01-split-bill';

describe('splitBill', () => {
  it('splits evenly', () => expect(splitBill(900, 3)).toEqual([300, 300, 300]));
  it('gives leftover cents to the first people', () => expect(splitBill(1000, 3)).toEqual([334, 333, 333]));
  it('always sums to the total', () => {
    const parts = splitBill(10001, 7);
    expect(parts.reduce((a, b) => a + b, 0)).toBe(10001);
  });
  it('handles fewer cents than people', () => expect(splitBill(2, 4)).toEqual([1, 1, 0, 0]));
  it('handles zero', () => expect(splitBill(0, 2)).toEqual([0, 0]));
  it('rejects bad input', () => {
    expect(() => splitBill(100, 0)).toThrow(RangeError);
    expect(() => splitBill(10.5, 2)).toThrow(RangeError);
    expect(() => splitBill(-1, 2)).toThrow(RangeError);
    expect(() => splitBill(0,0)).toThrow(RangeError);
  });
});
