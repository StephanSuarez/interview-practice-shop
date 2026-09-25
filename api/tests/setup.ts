import { afterAll, beforeAll, beforeEach } from 'vitest';
import { migrate, pool } from '../src/db';

beforeAll(async () => {
  await migrate();
});

beforeEach(async () => {
  await pool.query(
    'TRUNCATE payments, order_items, orders, products, users RESTART IDENTITY CASCADE',
  );
});

afterAll(async () => {
  await pool.end();
});
