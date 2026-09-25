import { Router } from 'express';
import { z } from 'zod';
import * as orders from '../services/orders';

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive().max(100),
      }),
    )
    .min(1),
});

const idParam = z.coerce.number().int().positive();

// Mounted behind requireAuth, so req.user is always set here.
export const ordersRouter = Router();

ordersRouter.get('/', async (req, res) => {
  res.json(await orders.listOrders(req.user!.id));
});

ordersRouter.get('/:id', async (req, res) => {
  const order = await orders.getOrder(req.user!.id, idParam.parse(req.params.id));
  res.json(order);
});

ordersRouter.post('/', async (req, res) => {
  const { items } = createOrderSchema.parse(req.body);
  const order = orders.createOrder(req.user!.id, items);
  res.status(201).json(order);
});
