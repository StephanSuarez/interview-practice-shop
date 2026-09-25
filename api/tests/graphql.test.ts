import { describe, expect, it } from 'vitest';
import { api, createProduct, createUser } from './helpers';

function gql(query: string, variables: object = {}, token?: string) {
  const req = api().post('/graphql').send({ query, variables });
  return token ? req.set('Authorization', `Bearer ${token}`) : req;
}

describe('GraphQL', () => {
  it('lists products without auth', async () => {
    await createProduct({ name: 'Mug', priceCents: 1150 });
    const res = await gql('{ products { name priceCents } }');
    expect(res.body.data.products).toEqual([{ name: 'Mug', priceCents: 1150 }]);
  });

  it('requires auth for myOrders', async () => {
    const res = await gql('{ myOrders { id } }');
    expect(res.body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
  });

  it('creates an order', async () => {
    const { token } = await createUser();
    const mug = await createProduct({ priceCents: 700 });
    const res = await gql(
      'mutation($items: [OrderItemInput!]!) { createOrder(items: $items) { id status totalCents } }',
      { items: [{ productId: mug.id, quantity: 2 }] },
      token,
    );
    expect(res.body.data.createOrder).toMatchObject({ status: 'pending', totalCents: 1400 });
  });

  it('exposes business errors like out of stock', async () => {
    const { token } = await createUser();
    const mug = await createProduct({ stock: 0 });
    const res = await gql(
      'mutation($items: [OrderItemInput!]!) { createOrder(items: $items) { id } }',
      { items: [{ productId: mug.id, quantity: 1 }] },
      token,
    );
    expect(res.body.errors[0].message).toMatch(/out of stock/);
  });
});
