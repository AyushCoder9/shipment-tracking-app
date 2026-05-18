import { customAlphabet } from 'nanoid';

// Crockford-style alphabet (no I/O/0/1) for human-readable tracking codes.
const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const generate = customAlphabet(alphabet, 8);

export function generateTrackingNumber(): string {
  return `SMX-${generate()}`;
}
