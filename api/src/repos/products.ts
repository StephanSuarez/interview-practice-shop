import type { Db } from '../db';

export interface Product {
  id: number;
  name: string;
  priceCents: number;
  stock: number;
}

const toProduct = (r: any): Product => ({
  id: r.id,
  name: r.name,
  priceCents: r.price_cents,
  stock: r.stock,
});

export async function listProducts(db: Db): Promise<Product[]> {
  const { rows } = await db.query('SELECT * FROM products ORDER BY id');
  return rows.map(toProduct);
}

export async function findProductsByIds(db: Db, ids: number[]): Promise<Product[]> {
  const { rows } = await db.query('SELECT * FROM products WHERE id = ANY($1)', [ids]);
  return rows.map(toProduct);
}

export async function insertProduct(
  db: Db,
  p: { name: string; priceCents: number; stock: number },
): Promise<Product> {
  const { rows } = await db.query(
    'INSERT INTO products (name, price_cents, stock) VALUES ($1, $2, $3) RETURNING *',
    [p.name, p.priceCents, p.stock],
  );
  return toProduct(rows[0]);
}

/** Returns false when there is not enough stock. The WHERE makes the check-and-decrement atomic. */
export async function decrementStock(db: Db, productId: number, quantity: number): Promise<boolean> {
  const { rowCount } = await db.query(
    'UPDATE products SET stock = stock - $2 WHERE id = $1 AND stock >= $2',
    [productId, quantity],
  );
  return rowCount === 1;
}
