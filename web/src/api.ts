export interface Product {
  id: number;
  name: string;
  priceCents: number;
  stock: number;
}

export interface Order {
  id: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  totalCents: number;
  createdAt: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, body.error ?? `Request failed (${res.status})`);
  return body as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  products: () => request<Product[]>('/products'),
  orders: (token: string) => request<Order[]>('/orders', {}, token),
  createOrder: (token: string, items: { productId: number; quantity: number }[]) =>
    request<Order>('/orders', { method: 'POST', body: JSON.stringify({ items }) }, token),
};

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export const formatCents = (cents: number) => usd.format(cents / 100);
