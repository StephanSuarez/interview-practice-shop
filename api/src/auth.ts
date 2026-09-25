import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { config } from './config';
import { HttpError } from './errors';

export interface AuthUser {
  id: number;
  email: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 32).toString('hex')}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  const expected = Buffer.from(hash, 'hex');
  const actual = scryptSync(password, salt, 32);
  return timingSafeEqual(actual, expected);
}

export function signToken(user: AuthUser): string {
  return jwt.sign({ email: user.email }, config.jwtSecret, {
    subject: String(user.id),
    expiresIn: '1h',
  });
}

export function verifyToken(token: string): AuthUser {
  const payload = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] }) as jwt.JwtPayload;
  return { id: Number(payload.sub), email: payload.email };
}

/** Reads "Authorization: Bearer <token>". Returns null when absent or invalid. */
export function userFromHeader(header: string | null | undefined): AuthUser | null {
  if (!header?.startsWith('Bearer ')) return null;
  try {
    return verifyToken(header.slice('Bearer '.length));
  } catch {
    return null;
  }
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const user = userFromHeader(req.headers.authorization);
  if (!user) throw new HttpError(401, 'Unauthorized');
  req.user = user;
  next();
};
