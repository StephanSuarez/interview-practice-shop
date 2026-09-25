import { useEffect, useState } from 'react';
import { api, type Order } from './api';
import { LoginForm } from './LoginForm';
import { OrderForm } from './OrderForm';
import { OrdersList } from './OrdersList';

export function App() {
  const [token, setToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!token) return;
    api.orders(token).then(setOrders);
  }, [token]);

  if (!token) return <LoginForm onLogin={setToken} />;

  return (
    <main>
      <OrderForm
        token={token}
        onCreated={(order) => {
          orders.unshift(order);
          setOrders(orders);
        }}
      />
      <h2>My orders</h2>
      <OrdersList orders={orders} />
    </main>
  );
}
