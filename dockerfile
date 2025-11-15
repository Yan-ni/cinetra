FROM node:25.1.0-alpine3.22 AS node-pnpm

RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -

ENV PNPM_HOME="/root/.local/share/pnpm"

ENV PATH="$PNPM_HOME:$PATH"

FROM node-pnpm AS frontend-builder

WORKDIR /frontend

COPY frontend/package.json .
COPY frontend/pnpm-lock.yaml .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY frontend .

RUN pnpm build

FROM node-pnpm

WORKDIR /backend

COPY backend/package.json .
COPY backend/pnpm-lock.yaml .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY backend .

RUN pnpm prisma generate

RUN pnpm build

COPY --from=frontend-builder /frontend/dist ./dist/ui

CMD ["pnpm", "start"]
