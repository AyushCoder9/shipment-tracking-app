import { buildApp } from './app';
import { env, useMongo } from './config/env';

async function main() {
  const app = await buildApp();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(
      `[samex-api] listening on http://localhost:${env.port}  (storage: ${useMongo ? 'mongo' : 'json'})`,
    );
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[samex-api] fatal startup error:', err);
  process.exit(1);
});
