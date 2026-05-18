import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { shipmentsApi, type CreateShipmentInput } from '../api/shipments';
import type { ShipmentStatus } from '../types/shipment';

const KEY = {
  list: ['shipments'] as const,
  stats: ['shipments', 'stats'] as const,
};

export function useShipments() {
  return useQuery({ queryKey: KEY.list, queryFn: shipmentsApi.list });
}

export function useShipmentStats() {
  return useQuery({ queryKey: KEY.stats, queryFn: shipmentsApi.stats });
}

export function useCreateShipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateShipmentInput) => shipmentsApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY.list });
      qc.invalidateQueries({ queryKey: KEY.stats });
    },
  });
}

export function useUpdateStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: ShipmentStatus; note?: string }) =>
      shipmentsApi.updateStatus(id, status, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY.list });
      qc.invalidateQueries({ queryKey: KEY.stats });
    },
  });
}
