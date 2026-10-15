# Dockerfile para el backend de Honatu
# Contexto de build: raíz del repositorio (ej. docker build -f backend/Dockerfile -t honatu-backend .)

FROM node:20-alpine AS deps

WORKDIR /app

# Solo copiamos manifests para aprovechar el cache de Docker
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json

# Instalar dependencias de producción solo para el workspace del backend
RUN npm ci --workspace=backend --omit=dev


FROM node:20-alpine AS runner

WORKDIR /app/backend
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=5000

# Copiar dependencias instaladas y el código del backend
COPY --from=deps /app/node_modules ../node_modules
COPY backend/ ./

EXPOSE 5000

CMD ["node", "server.js"]
