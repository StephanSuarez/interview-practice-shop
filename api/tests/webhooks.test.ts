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

describe('idempotency and status transitions', () => {
  const paid = (orderId: number, eventId = 'evt_1') => ({ eventId, orderId, status: 'paid', amountCents: 1000 });
  const failed = (orderId: number, eventId = 'evt_2') => ({ eventId, orderId, status: 'failed', amountCents: 1000 });

  async function statusOf(orderId: number) {
    const { rows } = await pool.query('SELECT status FROM orders WHERE id = $1', [orderId]);
    return rows[0].status;
  }

  it('processes a repeated event only once', async () => {
    const order = await createOrder();
    expect((await sendEvent(paid(order.id))).status).toBe(200);
    expect((await sendEvent(paid(order.id))).status).toBe(200);
    expect(await count('payments')).toBe(1);
  });

  it('processes concurrent duplicates only once', async () => {
    const order = await createOrder();
    const results = await Promise.all(Array.from({ length: 5 }, () => sendEvent(paid(order.id))));
    expect(results.map((r) => r.status)).toEqual([200, 200, 200, 200, 200]);
    expect(await count('payments')).toBe(1);
  });

  it('does not let a late "failed" event overwrite a paid order', async () => {
    const order = await createOrder();
    await sendEvent(paid(order.id, 'evt_1'));
    const res = await sendEvent(failed(order.id, 'evt_2'));
    expect(res.status).toBe(200);
    expect(await statusOf(order.id)).toBe('paid');
  });

  it('allows paying an order after a failed attempt', async () => {
    const order = await createOrder();
    await sendEvent(failed(order.id, 'evt_1'));
    await sendEvent(paid(order.id, 'evt_2'));
    expect(await statusOf(order.id)).toBe('paid');
  });
});
