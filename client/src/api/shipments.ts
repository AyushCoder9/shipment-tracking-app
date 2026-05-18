import { api } from './client';
import type { Shipment, ShipmentStats, ShipmentStatus } from '../types/shipment';

export interface CreateShipmentInput {
  sender: string;
  receiver: string;
  origin: string;
  destination: string;
  weightKg?: number;
  notes?: string;
}

export const shipmentsApi = {
  list: () => api<Shipment[]>('/shipments'),
  stats: () => api<ShipmentStats>('/shipments/stats'),
  get: (id: string) => api<Shipment>(`/shipments/${id}`),
  create: (input: CreateShipmentInput) =>
    api<Shipment>('/shipments', { method: 'POST', body: input, auth: true }),
  updateStatus: (id: string, status: ShipmentStatus, note?: string) =>
    api<Shipment>(`/shipments/${id}/status`, {
      method: 'PATCH',
      body: { status, note },
      auth: true,
    }),
  remove: (id: string) => api<void>(`/shipments/${id}`, { method: 'DELETE', auth: true }),
};
