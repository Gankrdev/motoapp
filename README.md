# MotoApp

Red social de contenido creativo con grabación y publicación de rutas GPS geolocalizadas.

## Stack

- **Mobile:** React Native con Expo (Expo Router)
- **Web:** Next.js con App Router
- **API:** Node.js + Fastify
- **Base de datos:** PostgreSQL + PostGIS
- **ORM:** Drizzle ORM
- **Monorepo:** pnpm workspaces + Turborepo

## Estructura del monorepo

```
├── apps/
│   ├── api/        # Fastify (REST API)
│   ├── web/        # Next.js (landing + dashboard)
│   └── mobile/     # Expo (iOS + Android)
├── packages/
│   ├── db/         # Drizzle schema + migraciones
│   ├── types/      # Tipos TypeScript compartidos
│   └── config/     # ESLint, tsconfig base
```

## Setup local

### Requisitos

- Node.js 20+
- pnpm 9+
- Docker

### Instalacion

```bash
# Instalar dependencias
pnpm install

# Levantar PostgreSQL + PostGIS
docker compose up -d

# Aplicar schema a la base de datos
cd packages/db && pnpm drizzle-kit push

# Levantar el API
cd apps/api && pnpm dev
```

### Variables de entorno

Crear `apps/api/.env`:

```
DATABASE_URL=postgresql://motoapp:motoapp_dev@localhost:5432/motoapp
JWT_SECRET=tu-secret-aqui
```

## Servicios externos

- **Stripe** — pagos y suscripciones
- **Mapbox** — renderizado de rutas GPS
- **Firebase / APNs** — push notifications
- **Cloudflare R2** — almacenamiento de fotos y videos
