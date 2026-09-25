import type { Db } from '../db';

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  totalCents: number;
  createdAt: Date;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  unitPriceCents: number;
}

const toOrder = (r: any): Order => ({
  id: r.id,
  userId: r.user_id,
  status: r.status,
  totalCents: r.total_cents,
  createdAt: r.created_at,
});

export async function insertOrder(db: Db, userId: number, totalCents: number): Promise<Order> {
  const { rows } = await db.query(
    'INSERT INTO orders (user_id, total_cents) VALUES ($1, $2) RETURNING *',
    [userId, totalCents],
  );
  return toOrder(rows[0]);
}

export async function insertOrderItem(db: Db, orderId: number, item: OrderItem): Promise<void> {
  await db.query(
    'INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents) VALUES ($1, $2, $3, $4)',
    [orderId, item.productId, item.quantity, item.unitPriceCents],
  );
}

export async function findOrderById(db: Db, id: number): Promise<Order | null> {
  const { rows } = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
  return rows.length ? toOrder(rows[0]) : null;
}

export async function listOrdersByUser(db: Db, userId: number): Promise<Order[]> {
  const { rows } = await db.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC',
    [userId],
  );
  return rows.map(toOrder);
}

export async function findItemsByOrderId(db: Db, orderId: number): Promise<OrderItem[]> {
  const { rows } = await db.query(
    'SELECT product_id, quantity, unit_price_cents FROM order_items WHERE order_id = $1 ORDER BY id',
    [orderId],
  );
  return rows.map((r) => ({
    productId: r.product_id,
    quantity: r.quantity,
    unitPriceCents: r.unit_price_cents,
  }));
}

export async function updateOrderStatus(db: Db, id: number, status: OrderStatus): Promise<void> {
  await db.query('UPDATE orders SET status = $2 WHERE id = $1', [id, status]);
}

export async function insertPayment(
  db: Db,
  p: { orderId: number; providerEventId: string; status: string; amountCents: number },
): Promise<void> {
  await db.query(
    'INSERT INTO payments (order_id, provider_event_id, status, amount_cents) VALUES ($1, $2, $3, $4)',
    [p.orderId, p.providerEventId, p.status, p.amountCents],
  );
}
