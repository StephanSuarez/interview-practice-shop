import { describe, expect, it } from 'vitest';
import { transition } from './05-order-status';

describe('transition', () => {
  it.each([
    ['pending', 'paid'],
    ['pending', 'failed'],
    ['pending', 'cancelled'],
    ['failed', 'paid'],
  ] as const)('allows %s -> %s', (from, to) => expect(transition(from, to)).toBe(to));

  it.each([
    ['paid', 'failed'],
    ['paid', 'pending'],
    ['cancelled', 'paid'],
    ['failed', 'pending'],
  ] as const)('rejects %s -> %s', (from, to) => {
    expect(() => transition(from, to)).toThrow(`Invalid transition: ${from} -> ${to}`);
  });

  it('treats the same status as a no-op', () => expect(transition('paid', 'paid')).toBe('paid'));
});
