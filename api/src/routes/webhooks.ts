import express, { Router } from 'express';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { config } from '../config';
import { HttpError } from '../errors';
import { handlePaymentEvent } from '../services/payments';

const paymentEventSchema = z.object({
  eventId: z.string().min(1),
  orderId: z.number().int().positive(),
  status: z.enum(['paid', 'failed']),
  amountCents: z.number().int().nonnegative(),
});

export function sign(rawBody: Buffer | string): string {
  return createHmac('sha256', config.webhookSecret).update(rawBody).digest('hex');
}

function isValidSignature(rawBody: Buffer, signature: string | undefined): boolean {
  if (!signature) return false;
  const expected = Buffer.from(sign(rawBody), 'hex');
  const actual = Buffer.from(signature, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export const webhooksRouter = Router();

// Raw body: the signature is computed over the exact bytes the provider sent.
webhooksRouter.post('/payments', express.raw({ type: 'application/json' }), async (req, res) => {
  const rawBody: Buffer = req.body;
  if (!Buffer.isBuffer(rawBody) || !isValidSignature(rawBody, req.header('x-signature'))) {
    throw new HttpError(401, 'Invalid signature');
  }
  const event = paymentEventSchema.parse(JSON.parse(rawBody.toString('utf8')));
  await handlePaymentEvent(event);
  res.status(200).json({ received: true });
});
