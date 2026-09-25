import { formatCents, type Order } from './api';

export function OrdersList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) return <p>No orders yet.</p>;
  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Status</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id}>
            <td>{o.id}</td>
            <td>{o.status}</td>
            <td>{formatCents(o.totalCents)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
