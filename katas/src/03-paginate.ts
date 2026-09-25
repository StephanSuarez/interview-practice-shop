export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Offset pagination over an in-memory list. `page` starts at 1.
 *
 * - A page past the end returns `items: []` (not an error).
 * - `totalPages` is 0 for an empty list.
 * - Throw a RangeError if `page` or `pageSize` is not a positive integer.
 */
export function paginate<T>(items: T[], page: number, pageSize: number): Page<T> {
  throw new Error('Not implemented');
}
