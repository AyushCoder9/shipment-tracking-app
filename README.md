# Samex.Delivery — Shipment Tracker

A small but production-shaped slice of a B2B logistics platform.
Single-page **Shipment Tracker** with an Express API behind it.

> Built as the Samex.Delivery Full-Stack Engineering Intern assignment.
> Time-boxed; prioritised end-to-end correctness, FSM-driven status, and clean structure over surface polish.

---

## ✨ What's inside

- **Backend** — Node.js + Express + TypeScript
  - REST API at `/api/shipments` (list / create / get / update status / delete) + `/api/auth/login` + `/api/health` + `/api/shipments/stats`
  - **Authoritative status state machine** (`Pending → Picked Up → In Transit → Delivered`, `Cancelled` from any non-terminal)
  - **Repository pattern** with two interchangeable backends: JSON file (default, zero-setup) and MongoDB (set `MONGODB_URI`)
  - JWT auth gate on mutations, Zod validation, centralised error middleware, request logging, CORS
  - Per-shipment **status history** (audit trail) appended on every transition
  - Auto-generated tracking numbers (`SMX-XXXXXXXX`)
  - Seed data + reseed script

- **Frontend** — React + Vite + TypeScript + Tailwind
  - Single page: stats strip, search + status filter, shipments table, create modal, detail drawer with timeline
  - **TanStack Query** for fetching, caching, and automatic invalidation after mutations
  - Auth context (login screen + signed-out read-only mode)
  - Inline "Advance status" dropdown that only shows valid next states (mirrors server FSM)
  - Toast notifications, empty/loading/error states



## 🚀 Quick start

Requires **Node ≥ 18.17**. No database required for the default JSON storage.

```bash
# 1. Install
npm install

# 2. (optional) Configure
cp server/.env.example server/.env

# 3. Run both server + client
npm run dev
```

- Frontend → http://localhost:5173
- API     → http://localhost:4000

The dev script proxies `/api/*` from Vite to the Express server, so the UI just calls `/api/...` — no CORS hassle in development.

**Demo credentials:** `admin / samex2026` (change in `server/.env`).

> Reads (`GET /api/shipments`, `GET /api/shipments/stats`, `GET /api/shipments/:id`) are public so the dashboard renders on first load and `curl` checks are frictionless. **Mutations** (`POST`, `PATCH`, `DELETE`) require a Bearer token.

### Other scripts

```bash
npm run build      # type-check + build both server and client
npm run start      # run the built server (server only)
npm run seed       # restore the JSON store from the committed seed
```

---

## 🧪 API at a glance

| Method | Path                             | Auth | Purpose                            |
|--------|----------------------------------|------|------------------------------------|
| GET    | `/api/health`                    | —    | Liveness + which storage is in use |
| POST   | `/api/auth/login`                | —    | Exchange credentials for a JWT     |
| GET    | `/api/auth/me`                   | ✅    | Whoami                             |
| GET    | `/api/shipments`                 | —    | List all shipments                 |
| GET    | `/api/shipments/stats`           | —    | Counts per status                  |
| GET    | `/api/shipments/:id`             | —    | Single shipment with history       |
| POST   | `/api/shipments`                 | ✅    | Create a shipment (status=Pending) |
| PATCH  | `/api/shipments/:id/status`      | ✅    | Advance status (FSM-enforced)      |
| DELETE | `/api/shipments/:id`             | ✅    | Remove a shipment                  |

**Status state machine** (server is the source of truth):

```
Pending  ─►  Picked Up  ─►  In Transit  ─►  Delivered
   │           │              │
   └───────────┴──────────────┴────────►  Cancelled   (terminal)
```

Invalid transitions return `409 InvalidTransition` with `from`/`to` fields.

### Try it with curl

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"samex2026"}' | jq -r .token)

# Create
curl -s -X POST http://localhost:4000/api/shipments \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"sender":"Acme","receiver":"Bob","origin":"Mumbai","destination":"Delhi"}' | jq

# Advance status
curl -s -X PATCH http://localhost:4000/api/shipments/<id>/status \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"status":"Picked Up","note":"truck loaded"}' | jq
```

---

## 🗂 Project layout

```
.
├── package.json                # npm workspaces root, runs dev/build for both
├── server/
│   ├── data/shipments.json     # committed seed data (8 shipments)
│   └── src/
│       ├── index.ts            # entrypoint
│       ├── app.ts              # Express assembly + middleware wiring
│       ├── config/env.ts       # typed environment loader
│       ├── middleware/         # auth, validate, error handler
│       ├── routes/             # route definitions
│       ├── controllers/        # thin HTTP adapters
│       ├── services/           # business logic (FSM, history, tracking #)
│       ├── repositories/       # JSON + Mongo backends behind one interface
│       ├── models/             # Mongoose model (only used when Mongo is on)
│       ├── schemas/            # Zod request schemas
│       ├── utils/              # statusMachine, trackingNumber
│       └── seed.ts             # restore runtime store from the seed file
└── client/
    └── src/
        ├── main.tsx            # React + React Query + Auth + Toast providers
        ├── App.tsx             # page composition + filtering logic
        ├── api/                # fetch client, shipments API, auth API
        ├── context/            # Auth + Toast contexts
        ├── hooks/useShipments  # React Query hooks + invalidation
        ├── components/         # Header, StatsStrip, FilterBar, Table, Modal, Drawer, Badge, Dropdown, LoginPage
        ├── types/              # shared types (mirrors server)
        └── utils/format.ts     # date/relative time helpers
```

---

## 🧰 Tech choices (and why)

| Choice                       | Why                                                                              |
|------------------------------|----------------------------------------------------------------------------------|
| **TypeScript everywhere**    | Cheap insurance against shape bugs; the shipment schema is shared in both heads. |
| **Express**                  | Smallest framework that hits the spec; well-known middleware ergonomics.         |
| **Repository pattern**       | Lets us ship the assignment with a JSON file *and* keep Mongo a one-env-var flip. |
| **Zod**                      | Validation + static types from the same schema. Better than ad-hoc `if/else`.   |
| **Status state machine**     | Authoritative on the server; UI only renders legal transitions.                  |
| **JWT (HS256)**              | Stateless, fits a single-process demo; the gate can be removed by flipping the routes if grading wants no auth. |
| **TanStack Query**           | Built-in caching, invalidation after mutations, and request dedup.               |
| **Tailwind**                 | Fast iteration on a single screen without a component library.                   |
| **Vite proxy `/api`**        | Zero CORS pain in dev; same-origin in prod when served behind a reverse proxy.   |

---

## ⏭ What I'd do next with more time

- **Tests** — Vitest + Supertest covering the FSM, validation errors, auth gates, and the repository pattern. (FSM is the highest-value target.)
- **Optimistic UI** — for the status-advance dropdown, with rollback on 409.
- **Server-side filtering & pagination** — `GET /api/shipments?status=&q=&cursor=` once the list grows.
- **Webhooks** — `POST /api/shipments/:id/events` for partner carriers to push tracking updates; HMAC signature.
- **Roles** — separate `admin` vs `dispatcher` vs `customer` views once we have a real user model.
- **Real auth** — users collection with bcrypt + refresh-token rotation; the current single-user flow is a stand-in.
- **Observability** — `pino` structured logs + request IDs + an `/api/metrics` Prometheus endpoint.
- **CI** — `npm ci && npm run build && npm test` on every push.
- **Deploy** — Dockerfile per app + a `docker-compose.yml` (API + Mongo + nginx serving the built client).

---

## 📄 License

Internal demo build, no license.
