import request from 'supertest';
import { buildApp } from '../src/app';
import { hashPassword, signToken } from '../src/auth';
import { pool } from '../src/db';
import { insertProduct } from '../src/repos/products';
import { insertUser } from '../src/repos/users';

export const app = buildApp();
export const api = () => request(app);

export async function createUser(email = 'ana@shop.test', password = 'secret123') {
  const user = await insertUser(pool, email, hashPassword(password));
  return { user, token: signToken({ id: user.id, email: user.email }) };
}

export function createProduct(overrides: Partial<{ name: string; priceCents: number; stock: number }> = {}) {
  return insertProduct(pool, { name: 'Mug', priceCents: 1000, stock: 10, ...overrides });
}

export async function count(table: string): Promise<number> {
  const { rows } = await pool.query(`SELECT count(*)::int AS n FROM ${table}`);
  return rows[0].n;
}
