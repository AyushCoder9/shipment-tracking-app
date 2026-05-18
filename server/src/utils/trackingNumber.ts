import crypto from 'crypto';

// Crockford-style alphabet (no I/O/0/1) for human-readable tracking codes.
const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generateTrackingNumber(): string {
  let id = '';
  const bytes = crypto.randomBytes(8);
  for (let i = 0; i < 8; i++) {
    id += alphabet[bytes[i] % alphabet.length];
  }
  return `SMX-${id}`;
}
