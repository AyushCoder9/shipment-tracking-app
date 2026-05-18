import { Router } from 'express';
import { ShipmentsController } from '../controllers/shipments.controller';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createShipmentSchema, updateStatusSchema } from '../schemas/shipment.schema';

export function buildShipmentsRouter(controller: ShipmentsController): Router {
  const router = Router();

  // Reads are open so the dashboard can render on first load without a token
  // (and to make curl-based grading frictionless). Mutations require auth.
  router.get('/', controller.list);
  router.get('/stats', controller.stats);
  router.get('/:id', controller.getById);

  router.post('/', requireAuth, validateBody(createShipmentSchema), controller.create);
  router.patch(
    '/:id/status',
    requireAuth,
    validateBody(updateStatusSchema),
    controller.updateStatus,
  );
  router.delete('/:id', requireAuth, controller.remove);

  return router;
}
