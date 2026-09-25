import { render, screen } from '@testing-library/react';
import { OrdersList } from './OrdersList';

describe('OrdersList', () => {
  it('shows an empty message', () => {
    render(<OrdersList orders={[]} />);
    expect(screen.getByText('No orders yet.')).toBeInTheDocument();
  });

  it('formats totals from cents', () => {
    render(
      <OrdersList orders={[{ id: 7, status: 'paid', totalCents: 264500, createdAt: '2026-01-01T00:00:00Z' }]} />,
    );
    expect(screen.getByText('$2,645.00')).toBeInTheDocument();
    expect(screen.getByText('paid')).toBeInTheDocument();
  });
});
