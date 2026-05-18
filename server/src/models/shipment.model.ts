import mongoose, { Schema, Document } from 'mongoose';
import { SHIPMENT_STATUSES, Shipment, ShipmentStatus, StatusHistoryEntry } from '../types/shipment';

type ShipmentDoc = Omit<Shipment, 'id'> & Document;

const historySchema = new Schema<StatusHistoryEntry>(
  {
    status: { type: String, enum: SHIPMENT_STATUSES, required: true },
    at: { type: String, required: true },
    note: { type: String },
  },
  { _id: false },
);

const shipmentSchema = new Schema<ShipmentDoc>(
  {
    trackingNumber: { type: String, required: true, unique: true, index: true },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: SHIPMENT_STATUSES,
      required: true,
      default: 'Pending',
      index: true,
    },
    weightKg: { type: Number },
    notes: { type: String },
    history: { type: [historySchema], default: [] },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id?.toString();
        delete ret._id;
      },
    },
  },
);

export const ShipmentModel = mongoose.model<ShipmentDoc>('Shipment', shipmentSchema);

export function toShipment(doc: ShipmentDoc): Shipment {
  return doc.toJSON() as unknown as Shipment;
}

export type { ShipmentStatus };
