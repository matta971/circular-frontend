# ===================================================
# Circular Electronics Frontend - Production Dockerfile
# ===================================================
# Multi-stage: Angular 20 build + Node.js SSR server

# Stage 1: Build Angular app (browser + server)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files (cached layer)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build for production (SSR mode generates browser/ + server/)
RUN npx ng build --configuration production

# Stage 2: Run SSR with Node.js
FROM node:20-alpine

WORKDIR /app

# Copy the built output
COPY --from=builder /app/dist/circular-frontend /app/dist/circular-frontend

EXPOSE 4000

ENV PORT=4000

HEALTHCHECK --interval=15s --timeout=5s --retries=5 --start-period=30s \
    CMD wget -q --spider http://localhost:4000 || exit 1

CMD ["node", "dist/circular-frontend/server/server.mjs"]
