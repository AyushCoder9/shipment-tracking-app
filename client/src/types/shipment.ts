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
  at: string;
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

export interface ShipmentStats {
  Pending: number;
  'Picked Up': number;
  'In Transit': number;
  Delivered: number;
  Cancelled: number;
}

const TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  Pending: ['Picked Up', 'Cancelled'],
  'Picked Up': ['In Transit', 'Cancelled'],
  'In Transit': ['Delivered', 'Cancelled'],
  Delivered: [],
  Cancelled: [],
};

export function allowedNext(from: ShipmentStatus): ShipmentStatus[] {
  return TRANSITIONS[from];
}
