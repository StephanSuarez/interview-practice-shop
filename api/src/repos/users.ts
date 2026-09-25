import type { Db } from '../db';

export interface UserRow {
  id: number;
  email: string;
  passwordHash: string;
}

export async function findUserByEmail(db: Db, email: string): Promise<UserRow | null> {
  const { rows } = await db.query(
    'SELECT id, email, password_hash FROM users WHERE email = $1',
    [email],
  );
  if (rows.length === 0) return null;
  return { id: rows[0].id, email: rows[0].email, passwordHash: rows[0].password_hash };
}

export async function insertUser(db: Db, email: string, passwordHash: string): Promise<UserRow> {
  const { rows } = await db.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, password_hash',
    [email, passwordHash],
  );
  return { id: rows[0].id, email: rows[0].email, passwordHash: rows[0].password_hash };
}
