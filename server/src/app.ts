import cors from 'cors';
import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';
import { env, useMongo } from './config/env';
import { ShipmentsController } from './controllers/shipments.controller';
import { errorHandler, notFoundHandler } from './middleware/error';
import { JsonShipmentsRepository } from './repositories/json.repository';
import { MongoShipmentsRepository } from './repositories/mongo.repository';
import type { ShipmentsRepository } from './repositories/shipments.repository';
import { buildAuthRouter } from './routes/auth.routes';
import { buildShipmentsRouter } from './routes/shipments.routes';
import { ShipmentsService } from './services/shipments.service';

export async function buildApp() {
  const repo: ShipmentsRepository = useMongo
    ? new MongoShipmentsRepository()
    : new JsonShipmentsRepository();
  await repo.init();

  const service = new ShipmentsService(repo);
  const controller = new ShipmentsController(service);

  const app = express();
  // CLIENT_ORIGIN may be a single origin or a comma-separated list (e.g. main + preview).
  const allowList = env.clientOrigin
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.use(
    cors({
      origin: (origin, cb) => {
        // Allow same-origin and curl/server-to-server (no Origin header).
        if (!origin) return cb(null, true);
        if (allowList.includes('*') || allowList.includes(origin)) return cb(null, true);
        return cb(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '256kb' }));
  if (env.nodeEnv !== 'test') app.use(morgan('dev'));

  app.get('/api/health', (_req, res) =>
    res.json({ status: 'ok', storage: useMongo ? 'mongo' : 'json', time: new Date().toISOString() }),
  );

  app.use('/api/auth', buildAuthRouter());
  app.use('/api/shipments', buildShipmentsRouter(controller));

  // Single-platform deploy: serve the built React client from the same
  // origin. Looks for ../../client/dist (relative to compiled dist/app.js).
  // Skips silently if the build is missing — useful in dev or API-only mode.
  const clientDist = path.resolve(__dirname, '../../client/dist');
  if (fs.existsSync(path.join(clientDist, 'index.html'))) {
    app.use(express.static(clientDist, { index: false, maxAge: '1h' }));
    app.get(/^\/(?!api\/).*/, (_req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
