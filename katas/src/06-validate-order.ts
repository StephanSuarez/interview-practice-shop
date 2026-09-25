export interface OrderInput {
  customerEmail: string;
  items: { sku: string; quantity: number }[];
}

export type Result = { ok: true; value: OrderInput } | { ok: false; errors: string[] };

/**
 * Validate untrusted JSON (e.g. a request body) WITHOUT a library.
 *
 * Rules, each with the exact error message:
 * - input must be an object                      -> "body must be an object"
 * - customerEmail must be a string containing @  -> "customerEmail is invalid"
 * - items must be a non-empty array              -> "items must be a non-empty array"
 * - each item: sku non-empty string              -> "items[i].sku is required"
 * - each item: quantity integer from 1 to 100    -> "items[i].quantity must be 1-100"
 *
 * Collect ALL errors, don't stop at the first. `i` is the item index.
 * If the body is not an object, return only that first error.
 */
export function validateOrder(input: unknown): Result {
  throw new Error('Not implemented');
}
