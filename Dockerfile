# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Run SSR
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist/hms-angular ./dist/hms-angular
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000
CMD ["node", "dist/hms-angular/server/server.mjs"]
