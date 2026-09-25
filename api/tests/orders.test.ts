import { describe, expect, it } from 'vitest';
import { pool } from '../src/db';
import { api, createProduct, createUser } from './helpers';

describe('POST /orders', () => {
  it('creates an order and computes the total in cents', async () => {
    const { token } = await createUser();
    const mug = await createProduct({ priceCents: 1150, stock: 5 });
    const filter = await createProduct({ name: 'Filter', priceCents: 115, stock: 50 });

    const res = await api()
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: mug.id, quantity: 2 }, { productId: filter.id, quantity: 3 }] });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: expect.any(Number), status: 'pending', totalCents: 2645 });
    expect(res.body.items).toHaveLength(2);
  });

    it('charges 115 cents for one $1.15 item', async () => {
    const { token } = await createUser();
    const filter = await createProduct({ name: 'Filter', priceCents: 115, stock: 50 });

    const res = await api()
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: filter.id, quantity: 1 }] });

    expect(res.body.totalCents).toBe(115);
  });

  it('decrements stock', async () => {
    const { token } = await createUser();
    const mug = await createProduct({ stock: 5 });

    await api()
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: mug.id, quantity: 2 }] });

    const { rows } = await pool.query('SELECT stock FROM products WHERE id = $1', [mug.id]);
    expect(rows[0].stock).toBe(3);
  });

  it('returns 409 when a product is out of stock', async () => {
    const { token } = await createUser();
    const mug = await createProduct({ stock: 1 });

    const res = await api()
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: mug.id, quantity: 2 }] });

    expect(res.status).toBe(409);
  });

  it('returns 404 for an unknown product', async () => {
    const { token } = await createUser();
    const res = await api()
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: 999, quantity: 1 }] });
    expect(res.status).toBe(404);
  });

  it('rejects invalid quantities', async () => {
    const { token } = await createUser();
    const mug = await createProduct();
    const res = await api()
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: mug.id, quantity: 0 }] });
    expect(res.status).toBe(400);
  });
});

describe('GET /orders', () => {
  it('lists only my orders, newest first', async () => {
    const ana = await createUser('ana@shop.test');
    const bob = await createUser('bob@shop.test');
    const mug = await createProduct({ stock: 10 });
    const order = (token: string) =>
      api().post('/orders').set('Authorization', `Bearer ${token}`).send({ items: [{ productId: mug.id, quantity: 1 }] });

    const first = await order(ana.token);
    const second = await order(ana.token);
    await order(bob.token);

    const res = await api().get('/orders').set('Authorization', `Bearer ${ana.token}`);
    expect(res.status).toBe(200);
    expect(res.body.map((o: { id: number }) => o.id)).toEqual([second.body.id, first.body.id]);
  });
});

describe('GET /orders/:id', () => {
  it('returns my order with its items', async () => {
    const { token } = await createUser();
    const mug = await createProduct({ priceCents: 500 });
    const created = await api()
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: mug.id, quantity: 3 }] });

    const res = await api().get(`/orders/${created.body.id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.items).toEqual([{ productId: mug.id, quantity: 3, unitPriceCents: 500 }]);
  });

  it('returns 404 for an unknown id and 400 for a non-numeric id', async () => {
    const { token } = await createUser();
    expect((await api().get('/orders/999').set('Authorization', `Bearer ${token}`)).status).toBe(404);
    expect((await api().get('/orders/abc').set('Authorization', `Bearer ${token}`)).status).toBe(400);
  });
});
