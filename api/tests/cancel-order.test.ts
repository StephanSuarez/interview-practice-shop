import { describe, expect, it } from 'vitest';
import { pool } from '../src/db';
import { api, createProduct, createUser } from './helpers';

async function setup() {
  const ana = await createUser('ana@shop.test');
  const bob = await createUser('bob@shop.test');
  const mug = await createProduct({ stock: 10 });
  const res = await api()
    .post('/orders')
    .set('Authorization', `Bearer ${ana.token}`)
    .send({ items: [{ productId: mug.id, quantity: 3 }] });
  return { ana, bob, mug, orderId: res.body.id as number };
}

const stockOf = async (id: number) =>
  (await pool.query('SELECT stock FROM products WHERE id = $1', [id])).rows[0].stock;

const cancel = (orderId: number, token: string) =>
  api().post(`/orders/${orderId}/cancel`).set('Authorization', `Bearer ${token}`);

describe('POST /orders/:id/cancel', () => {
  it('cancels my pending order and puts the stock back', async () => {
    const { ana, mug, orderId } = await setup();
    expect(await stockOf(mug.id)).toBe(7);

    const res = await cancel(orderId, ana.token);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: orderId, status: 'cancelled' });
    expect(await stockOf(mug.id)).toBe(10);
  });

  it('returns 404 for someone else\'s order', async () => {
    const { bob, orderId } = await setup();
    expect((await cancel(orderId, bob.token)).status).toBe(404);
  });

  it('returns 409 for a paid order', async () => {
    const { ana, orderId } = await setup();
    await pool.query(`UPDATE orders SET status = 'paid' WHERE id = $1`, [orderId]);
    expect((await cancel(orderId, ana.token)).status).toBe(409);
  });

  it('restores stock only once when cancelled twice', async () => {
    const { ana, mug, orderId } = await setup();
    await cancel(orderId, ana.token);
    expect((await cancel(orderId, ana.token)).status).toBe(409);
    expect(await stockOf(mug.id)).toBe(10);
  });

  it('requires auth', async () => {
    const { orderId } = await setup();
    expect((await api().post(`/orders/${orderId}/cancel`)).status).toBe(401);
  });
});
