import { randomUUID } from 'crypto';
import { NotFoundError } from '../middleware/error';
import { ShipmentsRepository } from '../repositories/shipments.repository';
import { CreateShipmentBody } from '../schemas/shipment.schema';
import { Shipment, ShipmentStatus } from '../types/shipment';
import { canTransition, InvalidTransitionError } from '../utils/statusMachine';
import { generateTrackingNumber } from '../utils/trackingNumber';

/**
 * The service layer holds the business rules:
 *   - tracking number generation
 *   - status state machine enforcement
 *   - audit history append on every status change
 * Controllers are kept thin; storage is hidden behind the repository.
 */
export class ShipmentsService {
  constructor(private readonly repo: ShipmentsRepository) {}

  list(): Promise<Shipment[]> {
    return this.repo.list();
  }

  async getById(id: string): Promise<Shipment> {
    const found = await this.repo.findById(id);
    if (!found) throw new NotFoundError(`Shipment ${id} not found`);
    return found;
  }

  async create(input: CreateShipmentBody): Promise<Shipment> {
    const now = new Date().toISOString();
    const shipment: Shipment = {
      id: randomUUID(),
      trackingNumber: generateTrackingNumber(),
      sender: input.sender,
      receiver: input.receiver,
      origin: input.origin,
      destination: input.destination,
      weightKg: input.weightKg,
      notes: input.notes,
      status: 'Pending',
      history: [{ status: 'Pending', at: now, note: 'Shipment created' }],
      createdAt: now,
      updatedAt: now,
    };
    return this.repo.create(shipment);
  }

  async updateStatus(id: string, next: ShipmentStatus, note?: string): Promise<Shipment> {
    const current = await this.getById(id);
    if (current.status === next) {
      // Idempotent no-op — return the existing shipment without appending history.
      return current;
    }
    if (!canTransition(current.status, next)) {
      throw new InvalidTransitionError(current.status, next);
    }
    const now = new Date().toISOString();
    const history = [...current.history, { status: next, at: now, note }];
    const updated = await this.repo.update(id, {
      status: next,
      history,
      updatedAt: now,
    });
    if (!updated) throw new NotFoundError(`Shipment ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const ok = await this.repo.remove(id);
    if (!ok) throw new NotFoundError(`Shipment ${id} not found`);
  }

  countByStatus() {
    return this.repo.countByStatus();
  }
}
