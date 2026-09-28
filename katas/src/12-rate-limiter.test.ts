import { describe, expect, it } from 'vitest';
import { RateLimiter } from './12-rate-limiter';

function setup(limit: number, windowMs: number) {
  let t = 0;
  const limiter = new RateLimiter(limit, windowMs, () => t);
  return { limiter, at: (ms: number) => { t = ms; } };
}

describe('RateLimiter', () => {
  it('allows up to the limit, then blocks', () => {
    const { limiter } = setup(3, 1000);
    expect([limiter.allow('ip'), limiter.allow('ip'), limiter.allow('ip'), limiter.allow('ip')])
      .toEqual([true, true, true, false]);
  });

  it('keeps keys independent', () => {
    const { limiter } = setup(1, 1000);
    expect(limiter.allow('a')).toBe(true);
    expect(limiter.allow('b')).toBe(true);
    expect(limiter.allow('a')).toBe(false);
  });

  it('slides the window instead of resetting it', () => {
    const { limiter, at } = setup(2, 1000);
    at(0);    expect(limiter.allow('ip')).toBe(true);
    at(600);  expect(limiter.allow('ip')).toBe(true);
    at(900);  expect(limiter.allow('ip')).toBe(false);
    at(1000); expect(limiter.allow('ip')).toBe(true);  // the call at 0 expired
    at(1100); expect(limiter.allow('ip')).toBe(false); // calls at 600 and 1000 still count
  });

  it('does not record rejected calls', () => {
    const { limiter, at } = setup(1, 1000);
    at(0);    expect(limiter.allow('ip')).toBe(true);
    at(500);  expect(limiter.allow('ip')).toBe(false);
    at(1000); expect(limiter.allow('ip')).toBe(true);
  });
});
