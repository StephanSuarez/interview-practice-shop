import { describe, expect, it } from 'vitest';
import { validateOrder } from './06-validate-order';

describe('validateOrder', () => {
  it('accepts a valid order', () => {
    const body = { customerEmail: 'a@b.co', items: [{ sku: 'MUG', quantity: 2 }] };
    expect(validateOrder(body)).toEqual({ ok: true, value: body });
  });
  it('rejects non-objects', () => {
    expect(validateOrder(null)).toEqual({ ok: false, errors: ['body must be an object'] });
    expect(validateOrder('x')).toEqual({ ok: false, errors: ['body must be an object'] });
    expect(validateOrder([])).toEqual({ ok: false, errors: ['body must be an object'] });
  });
  it('collects every error', () => {
    const result = validateOrder({
      customerEmail: 'nope',
      items: [{ sku: 'MUG', quantity: 1 }, { sku: '', quantity: 0 }, { quantity: 2.5 }],
    });
    expect(result).toEqual({
      ok: false,
      errors: [
        'customerEmail is invalid',
        'items[1].sku is required',
        'items[1].quantity must be 1-100',
        'items[2].sku is required',
        'items[2].quantity must be 1-100',
      ],
    });
  });
  it('requires a non-empty items array', () => {
    expect(validateOrder({ customerEmail: 'a@b.co', items: [] })).toEqual({
      ok: false,
      errors: ['items must be a non-empty array'],
    });
  });
});
