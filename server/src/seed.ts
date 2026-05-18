import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import { env, useMongo } from './config/env';
import { ShipmentModel } from './models/shipment.model';
import type { Shipment } from './types/shipment';

/**
 * Restores the chosen storage backend from the committed seed file.
 *
 *   - JSON path  (default): overwrites server/data/shipments.runtime.json
 *   - Mongo path (MONGODB_URI set): wipes the shipments collection and
 *     inserts the seed documents, indexed by trackingNumber.
 *
 * Run: `npm run seed` (from server/ or the workspace root).
 */
async function readSeed(): Promise<Shipment[]> {
  const seedPath = path.resolve(__dirname, '../data/shipments.json');
  const raw = await fs.readFile(seedPath, 'utf-8');
  return JSON.parse(raw) as Shipment[];
}

async function seedJson(seeds: Shipment[]): Promise<void> {
  const runtime = path.resolve(__dirname, '../data/shipments.runtime.json');
  await fs.writeFile(runtime, JSON.stringify(seeds, null, 2), 'utf-8');
  // eslint-disable-next-line no-console
  console.log(`[seed] wrote ${seeds.length} shipments → ${runtime}`);
}

async function seedMongo(seeds: Shipment[]): Promise<void> {
  // eslint-disable-next-line no-console
  console.log(`[seed] connecting to MongoDB…`);
  await mongoose.connect(env.mongoUri);
  await ShipmentModel.deleteMany({});
  // Drop the application-generated id; Mongo assigns _id. Spread keeps the rest.
  const docs = seeds.map(({ id: _ignored, ...rest }) => {
    void _ignored;
    return rest;
  });
  await ShipmentModel.insertMany(docs);
  // eslint-disable-next-line no-console
  console.log(`[seed] inserted ${docs.length} shipments into MongoDB`);
  await mongoose.disconnect();
}

async function main() {
  const seeds = await readSeed();
  if (useMongo) {
    await seedMongo(seeds);
  } else {
    await seedJson(seeds);
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[seed] failed:', err);
  process.exit(1);
});
