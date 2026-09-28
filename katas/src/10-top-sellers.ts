export interface OrderLine {
  sku: string;
  quantity: number;
}

export interface Order {
  id: number;
  status: 'pending' | 'paid' | 'cancelled';
  items: OrderLine[];
}

/**
 * Return the `n` best-selling SKUs by total quantity sold.
 *
 * - Count only orders with status 'paid'.
 * - The same SKU can appear in many orders, and even twice in one order: add them up.
 * - Result: [{ sku, quantity }], highest quantity first.
 *   On a tie, order by sku alphabetically (A before B).
 * - If there are fewer than `n` SKUs, return all of them. If `n` <= 0, return [].
 */
export function topSellers(orders: Order[], n: number): { sku: string; quantity: number }[] {
  throw new Error('Not implemented');
}
