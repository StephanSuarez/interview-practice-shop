import { hashPassword } from './auth';
import { migrate, pool } from './db';

await migrate();
await pool.query(
  `INSERT INTO users (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING`,
  ['demo@shop.test', hashPassword('password123')],
);
const { rowCount } = await pool.query('SELECT 1 FROM products');
if (rowCount === 0) {
  await pool.query(`
    INSERT INTO products (name, price_cents, stock) VALUES
      ('Coffee beans 500g', 1899, 40),
      ('Ceramic mug', 1150, 25),
      ('Pour-over filter', 115, 200),
      ('Grinder', 8900, 5)
  `);
}
console.log('Seeded. Login: demo@shop.test / password123');
await pool.end();
