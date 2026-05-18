import { z } from 'zod';
import { SHIPMENT_STATUSES } from '../types/shipment';

const trimmedString = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, `Must be at least ${min} characters`)
    .max(max, `Must be at most ${max} characters`);

export const createShipmentSchema = z.object({
  sender: trimmedString(2, 80),
  receiver: trimmedString(2, 80),
  origin: trimmedString(2, 120),
  destination: trimmedString(2, 120),
  weightKg: z.coerce.number().positive().max(100000).optional(),
  notes: z.string().trim().max(500).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(SHIPMENT_STATUSES),
  note: z.string().trim().max(300).optional(),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export type CreateShipmentBody = z.infer<typeof createShipmentSchema>;
export type UpdateStatusBody = z.infer<typeof updateStatusSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
