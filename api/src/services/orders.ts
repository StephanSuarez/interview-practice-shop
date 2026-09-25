import { pool, withTransaction } from '../db';
import { HttpError } from '../errors';
import * as ordersRepo from '../repos/orders';
import * as productsRepo from '../repos/products';

export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

export type OrderWithItems = ordersRepo.Order & { items: ordersRepo.OrderItem[] };

export async function createOrder(userId: number, items: CreateOrderItem[]): Promise<OrderWithItems> {
  return withTransaction(async (tx) => {
    const products = await productsRepo.findProductsByIds(tx, items.map((i) => i.productId));
    const byId = new Map(products.map((p) => [p.id, p]));

    const lines: ordersRepo.OrderItem[] = items.map((item) => {
      const product = byId.get(item.productId);
      if (!product) throw new HttpError(404, `Product ${item.productId} not found`);
      return { productId: item.productId, quantity: item.quantity, unitPriceCents: product.priceCents };
    });

    const totalCents = lines.reduce((sum, l) => sum + l.unitPriceCents * l.quantity, 0);
    const order = await ordersRepo.insertOrder(tx, userId, totalCents);

    for (const line of lines) {
      const reserved = await productsRepo.decrementStock(tx, line.productId, line.quantity);
      if (!reserved) throw new HttpError(409, `Product ${line.productId} is out of stock`);
      await ordersRepo.insertOrderItem(tx, order.id, line);
    }

    return { ...order, items: lines };
  });
}

export async function getOrder(userId: number, orderId: number): Promise<OrderWithItems> {
  const order = await ordersRepo.findOrderById(pool, orderId);
  // Same 404 for "missing" and "not yours", so ids of other users' orders don't leak.
  if (!order || order.userId !== userId) throw new HttpError(404, 'Order not found');
  const items = await ordersRepo.findItemsByOrderId(pool, orderId);
  return { ...order, items };
}

export async function listOrders(userId: number): Promise<ordersRepo.Order[]> {
  return ordersRepo.listOrdersByUser(pool, userId);
}
