import { describe, expect, it } from 'vitest';
import { topSellers, type Order } from './10-top-sellers';

const orders: Order[] = [
  { id: 1, status: 'paid', items: [{ sku: 'MUG', quantity: 2 }, { sku: 'BEANS', quantity: 1 }] },
  { id: 2, status: 'paid', items: [{ sku: 'FILTER', quantity: 5 }, { sku: 'MUG', quantity: 1 }] },
  { id: 3, status: 'pending', items: [{ sku: 'GRINDER', quantity: 50 }] },
  { id: 4, status: 'cancelled', items: [{ sku: 'BEANS', quantity: 40 }] },
  { id: 5, status: 'paid', items: [{ sku: 'BEANS', quantity: 2 }, { sku: 'BEANS', quantity: 1 }] },
];

describe('topSellers', () => {
  it('ranks paid quantities, highest first', () => {
    expect(topSellers(orders, 2)).toEqual([
      { sku: 'FILTER', quantity: 5 },
      { sku: 'BEANS', quantity: 4 },
    ]);
  });

  it('ignores pending and cancelled orders', () => {
    const skus = topSellers(orders, 10).map((r) => r.sku);
    expect(skus).not.toContain('GRINDER');
    expect(topSellers(orders, 10).find((r) => r.sku === 'BEANS')?.quantity).toBe(4);
  });

  it('breaks ties alphabetically', () => {
    const tied: Order[] = [
      { id: 1, status: 'paid', items: [{ sku: 'ZETA', quantity: 3 }, { sku: 'ALPHA', quantity: 3 }, { sku: 'MID', quantity: 3 }] },
    ];
    expect(topSellers(tied, 3).map((r) => r.sku)).toEqual(['ALPHA', 'MID', 'ZETA']);
  });

  it('returns everything when n is larger, and [] when n <= 0', () => {
    expect(topSellers(orders, 99)).toHaveLength(3);
    expect(topSellers(orders, 0)).toEqual([]);
    expect(topSellers([], 3)).toEqual([]);
  });
});
