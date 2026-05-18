import mongoose from 'mongoose';
import { Shipment, SHIPMENT_STATUSES, ShipmentStatus } from '../types/shipment';
import { env } from '../config/env';
import { ShipmentModel, toShipment } from '../models/shipment.model';
import { ShipmentsRepository } from './shipments.repository';

/**
 * Mongo-backed repository. Used automatically when MONGODB_URI is set.
 * Keeps the same surface as the JSON repo so the service layer is unchanged.
 */
export class MongoShipmentsRepository implements ShipmentsRepository {
  async init(): Promise<void> {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(env.mongoUri);
    }
  }

  async list(): Promise<Shipment[]> {
    const docs = await ShipmentModel.find().sort({ createdAt: -1 });
    return docs.map(toShipment);
  }

  async findById(id: string): Promise<Shipment | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    const doc = await ShipmentModel.findById(id);
    return doc ? toShipment(doc) : null;
  }

  async create(shipment: Shipment): Promise<Shipment> {
    // Drop the application-generated id; Mongo will assign _id.
    const { id: _ignored, ...rest } = shipment;
    void _ignored;
    const doc = await ShipmentModel.create(rest);
    return toShipment(doc);
  }

  async update(id: string, patch: Partial<Shipment>): Promise<Shipment | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    const doc = await ShipmentModel.findByIdAndUpdate(id, patch, { new: true });
    return doc ? toShipment(doc) : null;
  }

  async remove(id: string): Promise<boolean> {
    if (!mongoose.isValidObjectId(id)) return false;
    const res = await ShipmentModel.findByIdAndDelete(id);
    return Boolean(res);
  }

  async countByStatus(): Promise<Record<ShipmentStatus, number>> {
    const rows: Array<{ _id: ShipmentStatus; count: number }> = await ShipmentModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const counts = Object.fromEntries(SHIPMENT_STATUSES.map((s) => [s, 0])) as Record<
      ShipmentStatus,
      number
    >;
    for (const row of rows) counts[row._id] = row.count;
    return counts;
  }
}
