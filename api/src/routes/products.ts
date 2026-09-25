import { Router } from 'express';
import { pool } from '../db';
import { listProducts } from '../repos/products';

export const productsRouter = Router();

productsRouter.get('/', async (_req, res) => {
  res.json(await listProducts(pool));
});
