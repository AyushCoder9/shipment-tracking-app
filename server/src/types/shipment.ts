export const SHIPMENT_STATUSES = [
  'Pending',
  'Picked Up',
  'In Transit',
  'Delivered',
  'Cancelled',
] as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export interface StatusHistoryEntry {
  status: ShipmentStatus;
  at: string; // ISO timestamp
  note?: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  sender: string;
  receiver: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  weightKg?: number;
  notes?: string;
  history: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export type NewShipmentInput = Pick<
  Shipment,
  'sender' | 'receiver' | 'origin' | 'destination'
> & {
  weightKg?: number;
  notes?: string;
};
