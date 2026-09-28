/**
 * Parse a price typed by a user into integer cents, WITHOUT floating-point math
 * (remember 1.15 * 100 = 114.99999999999999).
 *
 * Accepted input:
 * - optional spaces around it, an optional leading "$", thousands commas (just ignore them),
 * - digits, optionally followed by "." and 1 or 2 digits.
 *
 *   "12" -> 1200     "0.5" -> 50     "7.05" -> 705     "$1,234.56" -> 123456     " 1.15 " -> 115
 *
 * Anything else throws an Error whose message is exactly `Invalid amount: <original input>`:
 *   "", "abc", "-5", "1.234", "1.2.3", "$", "12.", ".5"
 */
export function parseCents(input: string): number {
  throw new Error('Not implemented');
}
