import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { HttpError } from '../errors';
import { signToken, verifyPassword } from '../auth';
import { findUserByEmail } from '../repos/users';

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const user = await findUserByEmail(pool, email);
  // Same message for unknown email and wrong password: don't reveal which emails exist.
  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new HttpError(401, 'Invalid email or password');
  }
  res.json({ token: signToken({ id: user.id, email: user.email }) });
});
