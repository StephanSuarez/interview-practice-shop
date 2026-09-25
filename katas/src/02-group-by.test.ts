import { describe, expect, it } from 'vitest';
import { groupBy } from './02-group-by';

describe('groupBy', () => {
  it('groups by key keeping order', () => {
    const orders = [
      { id: 1, s: 'paid' },
      { id: 2, s: 'pending' },
      { id: 3, s: 'paid' },
    ];
    expect(groupBy(orders, (o) => o.s)).toEqual({
      paid: [orders[0], orders[2]],
      pending: [orders[1]],
    });
  });
  it('returns {} for an empty list', () => expect(groupBy([], String)).toEqual({}));
  it('works with keys like "constructor"', () => {
    expect(groupBy(['a'], () => 'constructor')).toEqual({ constructor: ['a'] });
  });
});
