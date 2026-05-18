import { Router } from 'express';
import { login, me } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { loginSchema } from '../schemas/shipment.schema';

export function buildAuthRouter(): Router {
  const router = Router();
  router.post('/login', validateBody(loginSchema), login);
  router.get('/me', requireAuth, me);
  return router;
}
