import pg from 'pg';
import { readdir, readFile } from 'node:fs/promises';
import { config } from './config';

export const pool = new pg.Pool({ connectionString: config.databaseUrl });

/** Anything that can run a query: the pool, or a client inside a transaction. */
export type Db = pg.Pool | pg.PoolClient;

// ponytail: re-runs every file on start, so migrations must be idempotent (IF NOT EXISTS).
// Add a migrations table when a migration can't be written that way.
export async function migrate(): Promise<void> {
  const dir = new URL('../migrations/', import.meta.url);
  for (const file of (await readdir(dir)).sort()) {
    await pool.query(await readFile(new URL(file, dir), 'utf8'));
  }
}

export async function withTransaction<T>(fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
