import { describe, expect, it } from 'vitest';
import { dedupeEvents } from './04-dedupe-events';

const e = (id: string, receivedAt: number) => ({ id, type: 'payment.paid', receivedAt });

describe('dedupeEvents', () => {
  it('keeps the first occurrence in arrival order', () => {
    const events = [e('a', 1), e('b', 2), e('a', 3), e('c', 4), e('b', 5)];
    expect(dedupeEvents(events)).toEqual([e('a', 1), e('b', 2), e('c', 4)]);
  });
  it('handles an empty list', () => expect(dedupeEvents([])).toEqual([]));
  it('is fast for large inputs', () => {
    const many = Array.from({ length: 200_000 }, (_, i) => e(String(i % 1000), i));
    const start = performance.now();
    expect(dedupeEvents(many)).toHaveLength(1000);
    expect(performance.now() - start).toBeLessThan(500);
  });
});
