import { describe, expect, it } from 'vitest';
import { pool } from '../src/db';
import { sign } from '../src/routes/webhooks';
import { api, count, createProduct, createUser } from './helpers';

async function createOrder() {
  const { token } = await createUser();
  const mug = await createProduct({ priceCents: 1000 });
  const res = await api()
    .post('/orders')
    .set('Authorization', `Bearer ${token}`)
    .send({ items: [{ productId: mug.id, quantity: 1 }] });
  return res.body as { id: number; totalCents: number };
}

function sendEvent(event: object, signature?: string) {
  const body = JSON.stringify(event);
  return api()
    .post('/webhooks/payments')
    .set('Content-Type', 'application/json')
    .set('x-signature', signature ?? sign(body))
    .send(body);
}

describe('POST /webhooks/payments', () => {
  it('marks the order as paid and records the payment', async () => {
    const order = await createOrder();
    const res = await sendEvent({ eventId: 'evt_1', orderId: order.id, status: 'paid', amountCents: 1000 });

    expect(res.status).toBe(200);
    const { rows } = await pool.query('SELECT status FROM orders WHERE id = $1', [order.id]);
    expect(rows[0].status).toBe('paid');
    expect(await count('payments')).toBe(1);
  });

  it('rejects a bad signature', async () => {
    const order = await createOrder();
    const res = await sendEvent({ eventId: 'evt_1', orderId: order.id, status: 'paid', amountCents: 1000 }, 'deadbeef');
    expect(res.status).toBe(401);
    expect(await count('payments')).toBe(0);
  });

  it('returns 404 for an unknown order', async () => {
    const res = await sendEvent({ eventId: 'evt_1', orderId: 999, status: 'paid', amountCents: 1000 });
    expect(res.status).toBe(404);
  });
});
