import { describe, expect, it } from 'vitest';
import { api, createUser } from './helpers';

describe('POST /auth/login', () => {
  it('returns a token for valid credentials', async () => {
    await createUser('ana@shop.test', 'secret123');
    const res = await api().post('/auth/login').send({ email: 'ana@shop.test', password: 'secret123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
  });

  it('rejects a wrong password', async () => {
    await createUser('ana@shop.test', 'secret123');
    const res = await api().post('/auth/login').send({ email: 'ana@shop.test', password: 'nope' });
    expect(res.status).toBe(401);
  });

  it('rejects malformed input', async () => {
    const res = await api().post('/auth/login').send({ email: 'not-an-email' });
    expect(res.status).toBe(400);
  });
});

describe('auth on protected routes', () => {
  it('rejects requests without a token', async () => {
    const res = await api().get('/orders');
    expect(res.status).toBe(401);
  });

  it('rejects an invalid token', async () => {
    const res = await api().get('/orders').set('Authorization', 'Bearer garbage');
    expect(res.status).toBe(401);
  });
});
