import { useEffect, useState, type FormEvent } from 'react';
import { api, formatCents, type Order, type Product } from './api';

export function OrderForm({ token, onCreated }: { token: string; onCreated: (order: Order) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.products().then((list) => {
      setProducts(list);
      setProductId(list[0]?.id ?? null);
    });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (productId === null) return;
    setError(null);
    try {
      onCreated(await api.createOrder(token, [{ productId, quantity }]));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>New order</h2>
      <label>
        Product
        <select value={productId ?? ''} onChange={(e) => setProductId(Number(e.target.value))}>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({formatCents(p.priceCents)})
            </option>
          ))}
        </select>
      </label>
      <label>
        Quantity
        <input
          type="number"
          min={1}
          max={100}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </label>
      <button type="submit">Place order</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
