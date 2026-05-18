# AI Usage Note

## Tools used

- **Claude Code (Anthropic)** as the primary pair programmer — project scaffold, FSM design, React component drafting, Tailwind styling, Framer Motion animation choreography, Recharts wiring, and documentation generation.
- Local toolchain — `tsc`, `vite`, `curl`, `node` — as the verification layer.

## Where AI moved fastest

- **Boilerplate at speed.** The Express + TypeScript skeleton, Zod schemas, Mongoose model, Tailwind config, Vite proxy, React Query setup, and the dual-platform deploy configs (`render.yaml`, `client/vercel.json`) all came together in a single pass instead of being typed out by hand.
- **Cross-file consistency.** Shared types (`Shipment`, `ShipmentStatus`), the state-machine adjacency map, the status palette, and the per-status icons all stay coherent between server and client because the assistant kept the cross-file picture in view — including the dark-mode pair classes added on every component.
- **The UI overhaul.** Around forty UI files were touched in one round: theme system, motion choreography, sparklines, donut chart, animated truck on an SVG motion path, count-ups, confetti, dark-mode pass on every component, refined design-system classes. Doing this by hand would have eaten most of the time budget.
- **Documentation depth.** The `README.md` (full project walkthrough, architecture diagrams, API reference, frontend tour, deploy guide), `INTERVIEW_QA.md` (seventy questions with deep answers), and this note. The drafts came out coherent and were edited rather than written from scratch.

## Where AI failed (and how I caught it)

- **A bad TypeScript cast in the Mongo model** survived its first generation and only surfaced when `npm run build -w server` ran. The compiler flagged it; I rewrote `toShipment` to go through `unknown` instead. Lesson: never trust AI-emitted type assertions — run `tsc` before believing them.
- **JWT signing types** — the assistant's first pass omitted the `SignOptions['expiresIn']` cast required by `@types/jsonwebtoken`. The build caught it.
- **Render deploy thrashed.** The first iteration assumed Render would install devDependencies by default, then hit `tsc: command not found` and the `moduleResolution=node10` deprecation error. The fix required understanding two things at once: that `NODE_ENV=production` (set in `render.yaml` for runtime) leaks into `npm install` and skips devDeps, and that TypeScript 5.5+ on Render's image errors on the `moduleResolution: "node"` alias. The eventual solution combined `NODE_ENV=development npm install --include=dev` for the build phase with a pin to `typescript@5.4.5`. The AI proposed several wrong fixes (Bundler resolution, `ignoreDeprecations: "6.0"`) before we converged on the right one.
- **CORS defaulted too tight.** The initial default for `CLIENT_ORIGIN` was `http://localhost:5173`, which blocked every request on the deployed Vercel host until I set the env var. Caught it in production logs and changed the default to `*`.
- **Seed file inconsistency** — one entry had a slightly different field name. Caught by reading the JSON before committing.

## How I verified the output

1. `npm run build` on both workspaces — caught the type errors above.
2. Started the server and end-to-end tested every endpoint with `curl`. Twenty-seven scripted assertions covering:
   - health,
   - login (good and bad creds),
   - reads open / mutations gated,
   - Zod field-level validation,
   - tracking-number format,
   - the full FSM (every legal transition succeeds, every illegal one returns 409),
   - terminal state behaviour,
   - 404, 401, 409, 204 paths,
   - CORS allow + block.
3. Spun up the dev server and did the full happy path in a browser — create a shipment, watch it appear with stagger, advance it through every status, confetti on `Delivered`, drawer timeline matches, dark-mode toggle smooth.
4. Read every committed file before commit. The AI is a fast typist; the engineer of record is still me.

## Bottom line

AI is a force multiplier on the parts of the job that don't need judgment: naming, syntax, boilerplate, dark-mode variant pairs, animation parameter tuning, and documentation. The decisions that mattered — repository pattern vs single store, FSM-on-server vs FSM-everywhere, reads open vs reads gated, JWT vs sessions, two-platform vs single-platform deploy, what to defer, when to stop — were mine. The verification (running `tsc`, hitting `curl`, reading the actual diff) was non-negotiable.
