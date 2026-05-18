import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { signToken } from '../middleware/auth';
import { HttpError } from '../middleware/error';
import { LoginBody } from '../schemas/shipment.schema';

/**
 * Single hardcoded user for the assignment. In production this would be a
 * proper user store (e.g. users collection + bcrypt hash + refresh tokens).
 * The constant-time comparison guards against trivial timing oracles.
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const login = (
  req: Request<unknown, unknown, LoginBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body;
    const ok =
      safeEqual(username, env.auth.username) && safeEqual(password, env.auth.password);
    if (!ok) {
      throw new HttpError(401, 'Invalid username or password');
    }
    const token = signToken({ sub: username, username });
    res.json({ token, user: { username } });
  } catch (err) {
    next(err);
  }
};

export const me = (req: Request, res: Response) => {
  res.json({ user: req.auth ? { username: req.auth.username } : null });
};
