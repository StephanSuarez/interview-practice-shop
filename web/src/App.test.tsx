import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { App } from './App';

function json(body: unknown, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(body), { status }));
}

describe('App', () => {
  it('logs in and shows my orders', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        if (url === '/api/auth/login') return json({ token: 't0k3n' });
        if (url === '/api/products') return json([{ id: 1, name: 'Mug', priceCents: 1150, stock: 3 }]);
        if (url === '/api/orders') return json([{ id: 1, status: 'pending', totalCents: 1150, createdAt: '' }]);
        return json({ error: 'not found' }, 404);
      }),
    );

    render(<App />);
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(await screen.findByText('My orders')).toBeInTheDocument();
    expect(await screen.findByText('pending')).toBeInTheDocument();
  });

  it('shows the error when login fails', async () => {
    vi.stubGlobal('fetch', vi.fn(() => json({ error: 'Invalid email or password' }, 401)));

    render(<App />);
    await userEvent.type(screen.getByLabelText('Password'), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password');
  });
});
