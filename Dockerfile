# ===================================================
# Circular Electronics Frontend - Production Dockerfile
# ===================================================
# Multi-stage: Angular 20 build + nginx serve

# Stage 1: Build Angular app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files (cached layer)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build for production
RUN npx ng build --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built Angular app
COPY --from=builder /app/dist/circular-frontend/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
    CMD wget -q --spider http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
