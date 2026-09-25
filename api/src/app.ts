import express from 'express';
import { requireAuth } from './auth';
import { errorHandler } from './errors';
import { yoga } from './graphql/schema';
import { authRouter } from './routes/auth';
import { ordersRouter } from './routes/orders';
import { productsRouter } from './routes/products';
import { webhooksRouter } from './routes/webhooks';

export function buildApp() {
  const app = express();

  // Before express.json(): webhooks need the raw body to verify signatures.
  app.use('/webhooks', webhooksRouter);
  app.use('/graphql', yoga);

  app.use(express.json());
  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });
  app.use('/auth', authRouter);
  app.use('/products', productsRouter);
  app.use('/orders', requireAuth, ordersRouter);

  app.use(errorHandler);
  return app;
}
