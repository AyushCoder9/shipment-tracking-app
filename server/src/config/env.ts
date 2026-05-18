import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  // In production we serve the SPA from this same Express process, so the
  // browser's Origin header equals the deploy URL. Allow everything by
  // default and let operators tighten with CLIENT_ORIGIN when they want
  // to. The dev server still uses :5173, which `*` also covers.
  clientOrigin: process.env.CLIENT_ORIGIN ?? '*',
  auth: {
    username: required('AUTH_USERNAME', 'admin'),
    password: required('AUTH_PASSWORD', 'samex2026'),
    jwtSecret: required('JWT_SECRET', 'dev-only-secret-change-in-prod'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '24h',
  },
  mongoUri: process.env.MONGODB_URI ?? '',
} as const;

export const useMongo = env.mongoUri.length > 0;
