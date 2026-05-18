import { Shipment, ShipmentStatus } from '../types/shipment';

/**
 * Repository interface — abstracts the storage backend so the service layer
 * does not care whether we are reading from a JSON file or MongoDB.
 */
export interface ShipmentsRepository {
  init(): Promise<void>;
  list(): Promise<Shipment[]>;
  findById(id: string): Promise<Shipment | null>;
  create(shipment: Shipment): Promise<Shipment>;
  update(id: string, patch: Partial<Shipment>): Promise<Shipment | null>;
  remove(id: string): Promise<boolean>;
  countByStatus(): Promise<Record<ShipmentStatus, number>>;
}
