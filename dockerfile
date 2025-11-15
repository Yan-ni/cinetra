FROM node:25.1.0-alpine3.22 AS frontend-builder

WORKDIR /frontend

COPY frontend/package*.json ./

RUN pnpm install

COPY frontend .

RUN pnpm run build

FROM node:25.1.0-alpine3.22

WORKDIR /backend

COPY backend/package*.json ./

RUN pnpm install

COPY backend .

RUN pnpm prisma generate

RUN pnpm run build

COPY --from=frontend-builder /frontend/dist ./dist/ui

CMD ["pnpm", "start"]
