import fs from 'fs/promises';
import path from 'path';

/**
 * Re-hydrates the runtime JSON store from the committed seed file.
 * Run: `npm run seed` (from server/ or workspace root).
 */
async function main() {
  const dataDir = path.resolve(__dirname, '../data');
  const seed = path.join(dataDir, 'shipments.json');
  const runtime = path.join(dataDir, 'shipments.runtime.json');
  const raw = await fs.readFile(seed, 'utf-8');
  await fs.writeFile(runtime, raw, 'utf-8');
  // eslint-disable-next-line no-console
  console.log(`[seed] wrote ${runtime}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[seed] failed:', err);
  process.exit(1);
});
