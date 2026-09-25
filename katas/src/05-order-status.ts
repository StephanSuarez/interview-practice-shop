export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

/**
 * Allowed transitions:
 *   pending -> paid | failed | cancelled
 *   failed  -> paid        (customer retried the payment)
 * Everything else is invalid: paid and cancelled are final.
 *
 * Return the new status, or throw an Error whose message contains both statuses,
 * e.g. "Invalid transition: paid -> failed".
 * Moving to the same status is a no-op and returns it (webhooks can repeat).
 */
export function transition(current: OrderStatus, next: OrderStatus): OrderStatus {
  throw new Error('Not implemented');
}
