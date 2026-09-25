import { withTransaction } from '../db';
import { HttpError } from '../errors';
import * as ordersRepo from '../repos/orders';

export interface PaymentEvent {
  eventId: string;
  orderId: number;
  status: 'paid' | 'failed';
  amountCents: number;
}

export async function handlePaymentEvent(event: PaymentEvent): Promise<void> {
  await withTransaction(async (tx) => {
    const order = await ordersRepo.findOrderById(tx, event.orderId);
    if (!order) throw new HttpError(404, 'Order not found');

    await ordersRepo.insertPayment(tx, {
      orderId: event.orderId,
      providerEventId: event.eventId,
      status: event.status,
      amountCents: event.amountCents,
    });
    await ordersRepo.updateOrderStatus(tx, event.orderId, event.status);
  });
}
