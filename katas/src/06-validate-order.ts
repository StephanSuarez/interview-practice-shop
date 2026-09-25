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
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { ok: false, errors: ['body must be an object'] }
  }

  const body: OrderInput = input as OrderInput;
  const errorsMsg: string[] = [];

  // validate customer email
  if (body != null && body.customerEmail && !body.customerEmail.includes('@')) {
    errorsMsg.push("customerEmail is invalid")
  }

  // validate itesm not empty arrays
  if (body != null && body.items && body.items.length === 0) {
    errorsMsg.push("items must be a non-empty array")
  }

  // validate each item: sku non-empty string and quantity
  body.items.forEach((item, i) => {
    if (item.sku === '' || item.sku === null || item.sku === undefined) {
      errorsMsg.push(`items[${i}].sku is required`)
    }
    if(!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
      errorsMsg.push(`items[${i}].quantity must be 1-100`)
    }
  })

  // validate each item: quantity integer from 1 to 100

  if (errorsMsg.length > 0) {
    return { ok: false, errors: errorsMsg }
  }

  return { ok: true, value: body }
}
