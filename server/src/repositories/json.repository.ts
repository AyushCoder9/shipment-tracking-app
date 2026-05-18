import fs from 'fs/promises';
import path from 'path';
import { Shipment, SHIPMENT_STATUSES, ShipmentStatus } from '../types/shipment';
import { ShipmentsRepository } from './shipments.repository';

const DATA_DIR = path.resolve(__dirname, '../../data');
const SEED_FILE = path.join(DATA_DIR, 'shipments.json');
const RUNTIME_FILE = path.join(DATA_DIR, 'shipments.runtime.json');

/**
 * JSON-file-backed repository. Keeps the seed file pristine and writes
 * mutations to `shipments.runtime.json`. A single async mutex serializes
 * writes to prevent torn writes in the (single-process) dev server.
 */
export class JsonShipmentsRepository implements ShipmentsRepository {
  private writeChain: Promise<unknown> = Promise.resolve();

  async init(): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(RUNTIME_FILE);
    } catch {
      // Hydrate runtime file from seed on first boot.
      let seed: Shipment[] = [];
      try {
        const raw = await fs.readFile(SEED_FILE, 'utf-8');
        seed = JSON.parse(raw) as Shipment[];
      } catch {
        seed = [];
      }
      await fs.writeFile(RUNTIME_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    }
  }

  private async readAll(): Promise<Shipment[]> {
    const raw = await fs.readFile(RUNTIME_FILE, 'utf-8');
    return JSON.parse(raw) as Shipment[];
  }

  private writeAll(shipments: Shipment[]): Promise<void> {
    const task = this.writeChain.then(() =>
      fs.writeFile(RUNTIME_FILE, JSON.stringify(shipments, null, 2), 'utf-8'),
    );
    this.writeChain = task.catch(() => undefined);
    return task;
  }

  async list(): Promise<Shipment[]> {
    const items = await this.readAll();
    // Newest first — UX expectation.
    return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async findById(id: string): Promise<Shipment | null> {
    const items = await this.readAll();
    return items.find((s) => s.id === id) ?? null;
  }

  async create(shipment: Shipment): Promise<Shipment> {
    const items = await this.readAll();
    items.push(shipment);
    await this.writeAll(items);
    return shipment;
  }

  async update(id: string, patch: Partial<Shipment>): Promise<Shipment | null> {
    const items = await this.readAll();
    const idx = items.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    const next: Shipment = { ...items[idx], ...patch, id: items[idx].id };
    items[idx] = next;
    await this.writeAll(items);
    return next;
  }

  async remove(id: string): Promise<boolean> {
    const items = await this.readAll();
    const next = items.filter((s) => s.id !== id);
    if (next.length === items.length) return false;
    await this.writeAll(next);
    return true;
  }

  async countByStatus(): Promise<Record<ShipmentStatus, number>> {
    const items = await this.readAll();
    const counts = Object.fromEntries(
      SHIPMENT_STATUSES.map((s) => [s, 0]),
    ) as Record<ShipmentStatus, number>;
    for (const item of items) counts[item.status]++;
    return counts;
  }
}
