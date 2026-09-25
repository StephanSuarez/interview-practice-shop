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


  const allowed: Record<OrderStatus, OrderStatus[]> = {
    'pending': ['paid', 'failed', 'cancelled'],
    'failed': ['paid'],
    'paid': [],
    'cancelled': []
  }

  // movin to the same status is a no-op, return it
  if(current===next){
    return current;
  }

  // validar allowed
  if(allowed[current] && allowed[current].includes(next)){
    return next
  }
  
  // cualquier otra transacccion es invalida
  throw new Error(`Invalid transition: ${current} -> ${next}`);
}
