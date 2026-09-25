import { describe, expect, it } from 'vitest';
import { paginate } from './03-paginate';

const ten = Array.from({ length: 10 }, (_, i) => i + 1);

describe('paginate', () => {
  it('returns the first page', () => {
    expect(paginate(ten, 1, 4)).toEqual({ items: [1, 2, 3, 4], page: 1, pageSize: 4, total: 10, totalPages: 3 });
  });
  it('returns a partial last page', () => expect(paginate(ten, 3, 4).items).toEqual([9, 10]));
  it('returns empty items past the end', () => expect(paginate(ten, 4, 4).items).toEqual([]));
  it('handles an empty list', () => expect(paginate([], 1, 5)).toMatchObject({ items: [], total: 0, totalPages: 0 }));
  it('rejects bad input', () => {
    expect(() => paginate(ten, 0, 4)).toThrow(RangeError);
    expect(() => paginate(ten, 1, 0)).toThrow(RangeError);
    expect(() => paginate(ten, 1.5, 4)).toThrow(RangeError);
  });
});
