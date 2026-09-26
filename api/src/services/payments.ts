import { withTransaction } from '../db';
import { HttpError } from '../errors';
import * as ordersRepo from '../repos/orders';

export interface PaymentEvent {
  eventId: string;
  orderId: number;
  status: 'paid' | 'failed';
  amountCents: number;
}

// Valid transitions: pending -> paid | failed, failed -> paid. `paid` is final.
const ALLOWED_FROM: Record<PaymentEvent['status'], ordersRepo.OrderStatus[]> = {
  paid: ['pending', 'failed'],
  failed: ['pending'],
};

export async function handlePaymentEvent(event: PaymentEvent): Promise<void> {
  await withTransaction(async (tx) => {
    const order = await ordersRepo.findOrderById(tx, event.orderId);
    if (!order) throw new HttpError(404, 'Order not found');

    // The unique index on provider_event_id makes a concurrent duplicate wait for this commit, then skip.
    const isNew = await ordersRepo.insertPayment(tx, {
      orderId: event.orderId,
      providerEventId: event.eventId,
      status: event.status,
      amountCents: event.amountCents,
    });
    if (!isNew) return;

    await ordersRepo.updateOrderStatus(tx, event.orderId, event.status, ALLOWED_FROM[event.status]);
  });
}
