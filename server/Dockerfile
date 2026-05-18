# Multi-stage Dockerfile for the Samex.Delivery API.
# Build context must be the repo root so npm workspaces resolve.
#
# Build:   docker build -f server/Dockerfile -t samex-api .
# Run:     docker run --rm -p 4000:4000 --env-file server/.env samex-api

FROM node:20-alpine AS build
WORKDIR /repo
COPY package.json package-lock.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/
RUN npm install --workspace server --include-workspace-root --no-audit --no-fund
COPY server ./server
RUN npm run build -w server

FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /repo/package.json /repo/package-lock.json ./
COPY --from=build /repo/server/package.json ./server/package.json
COPY --from=build /repo/server/dist ./server/dist
COPY --from=build /repo/server/data ./server/data
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/server/node_modules ./server/node_modules
EXPOSE 4000
CMD ["node", "server/dist/index.js"]
