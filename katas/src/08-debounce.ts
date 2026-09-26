/**
 * Return a function that delays calling `fn` until `ms` milliseconds have passed
 * since the LAST call. It calls `fn` with the arguments of that last call.
 * The returned function also has `cancel()` to drop a pending call.
 *
 * Typical use: search-as-you-type, so we hit the API once the user stops typing.
 */
export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  ms: number,
): ((...args: A) => void) & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: A) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, ms)
  }

  debounced.cancel = () => {
    clearTimeout(timer);
  }
  
  return debounced;
}
