import { ShipmentStatus } from '../types/shipment';

/**
 * Authoritative status state machine for a shipment.
 * Single source of truth — UI uses this via the API.
 *
 * Pending     → Picked Up | Cancelled
 * Picked Up   → In Transit | Cancelled
 * In Transit  → Delivered | Cancelled
 * Delivered   → (terminal)
 * Cancelled   → (terminal)
 */
const TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  Pending: ['Picked Up', 'Cancelled'],
  'Picked Up': ['In Transit', 'Cancelled'],
  'In Transit': ['Delivered', 'Cancelled'],
  Delivered: [],
  Cancelled: [],
};

export function canTransition(from: ShipmentStatus, to: ShipmentStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function allowedNextStatuses(from: ShipmentStatus): ShipmentStatus[] {
  return TRANSITIONS[from] ?? [];
}

export class InvalidTransitionError extends Error {
  readonly from: ShipmentStatus;
  readonly to: ShipmentStatus;
  constructor(from: ShipmentStatus, to: ShipmentStatus) {
    super(`Invalid status transition: ${from} → ${to}`);
    this.from = from;
    this.to = to;
    this.name = 'InvalidTransitionError';
  }
}
