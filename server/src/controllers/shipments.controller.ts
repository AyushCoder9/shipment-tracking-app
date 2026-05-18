import type { NextFunction, Request, Response } from 'express';
import { ShipmentsService } from '../services/shipments.service';
import { CreateShipmentBody, UpdateStatusBody } from '../schemas/shipment.schema';

export class ShipmentsController {
  constructor(private readonly service: ShipmentsService) {}

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.service.list());
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.service.getById(req.params.id));
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request<unknown, unknown, CreateShipmentBody>, res: Response, next: NextFunction) => {
    try {
      const created = await this.service.create(req.body);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  };

  updateStatus = async (
    req: Request<{ id: string }, unknown, UpdateStatusBody>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const updated = await this.service.updateStatus(req.params.id, req.body.status, req.body.note);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };

  stats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.service.countByStatus());
    } catch (err) {
      next(err);
    }
  };
}
