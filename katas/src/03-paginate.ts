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

  if(Number.isInteger(page) && page <= 0){
    throw new RangeError("page must be more than 0")
  }

  if(Number.isInteger(pageSize) && pageSize <= 0){
    throw new RangeError("pageSize must be more than 0")
  }

  if(!Number.isInteger(page)){
    throw new RangeError("page must be an integer")
  }

  if(!Number.isInteger(pageSize)){
    throw new RangeError("pageSize must be an integer")
  }

  const start = (page-1)*pageSize
  const end: number = (items.length - start > pageSize ) ? pageSize : items.length

  const pagination: Page<T> = {
    items: items.slice(start, end),
    page,
    pageSize,
    total: items.length,
    totalPages: Math.ceil(items.length / pageSize)
  }

  return pagination;
}
