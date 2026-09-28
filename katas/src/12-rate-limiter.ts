/**
 * Sliding-window rate limiter, e.g. "max 5 login attempts per minute per IP".
 *
 * - `allow(key)` returns true and records the call if that key made fewer than `limit`
 *   calls in the last `windowMs` milliseconds. Otherwise it returns false.
 * - A call made at time t still counts while `now - t < windowMs`.
 * - Rejected calls are NOT recorded.
 * - Each key is independent.
 * - `now` is injected so tests can control time. Never call Date.now() directly.
 */
export class RateLimiter {
  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  allow(key: string): boolean {
    throw new Error('Not implemented');
  }
}
