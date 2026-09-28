export interface OrderLine {
  sku: string;
  quantity: number;
}

export interface Order {
  id: number;
  status: "pending" | "paid" | "cancelled";
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
export function topSellers(
  orders: Order[],
  n: number,
): { sku: string; quantity: number }[] {
  // get all paid orders
  const paidOrders = orders.filter((order) => order.status === "paid");

  // get all items from paid orders
  const items = paidOrders.flatMap((order) => order.items);

  // count the quantity of each item
  const itemCounts = items.reduce((acc, item) => {
    (acc as Record<string, number>)[item.sku] = ((acc as Record<string, number>)[item.sku] || 0) + item.quantity;
    return acc;
  }, {});

  // sort the items by quantity and then by sku alphabetically if the quantity is the same
  const sortedItems = Object.entries(itemCounts as Record<string, number>).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  // return the top n items
  return sortedItems.slice(0, n).map(([sku, quantity]) => ({ sku, quantity: quantity as number }));

}
