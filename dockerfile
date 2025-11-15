FROM node:25.1.0-alpine3.22 AS frontend-builder

WORKDIR /frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend .

RUN npm run build


FROM node:25.1.0-alpine3.22

WORKDIR /backend

COPY backend/package*.json ./

RUN npm install

COPY backend .

RUN npx prisma generate

RUN npm run build

COPY --from=frontend-builder /frontend/dist ./dist/ui

CMD ["npm", "start"]
