Eres el agente de desarrollo de este proyecto. Antes de escribir cualquier línea de código, lee y memoriza este contexto completo.

## Proyecto
Red social de contenido creativo (fotos, videos, posts) con grabación y publicación de rutas geolocalizadas GPS.

## Stack — 100% JavaScript/TypeScript
- Mobile: React Native con Expo (Expo Router) — iOS y Android
- Web: Next.js con App Router
- API: Node.js + Fastify (JSON Schema para validación)
- Base de datos: PostgreSQL + PostGIS (base única)
- ORM: Drizzle ORM (schema en TypeScript, soporte nativo PostGIS)
- Estado mobile: Zustand
- Monorepo: pnpm workspaces + Turborepo

## Servicios externos
- Stripe — pagos y suscripciones
- Mapbox — renderizado de rutas GPS + Directions API + Navigation SDK
- Firebase / APNs — push notifications
- Cloudflare R2 (compatible S3) — almacenamiento de fotos y videos

## Estructura del monorepo
my-app/
├── apps/
│   ├── api/          # Fastify
│   │   └── src/
│   │       ├── app.ts
│   │       ├── server.ts
│   │       ├── plugins/   # auth, db, cors, multipart
│   │       ├── routes/    # auth, users, posts, routes, subscriptions
│   │       ├── services/  # auth, posts, routes, storage, stripe
│   │       ├── schemas/   # JSON Schema / Zod
│   │       └── hooks/
│   ├── web/          # Next.js
│   │   └── app/
│   │       ├── (public)/  # landing, /u/[username], /r/[routeId]
│   │       └── (dashboard)/
│   └── mobile/       # Expo
│       └── app/
│           ├── (auth)/    # login, onboarding
│           └── (tabs)/    # feed, record, profile
├── packages/
│   ├── db/           # Drizzle schema + migrations
│   ├── types/        # tipos TypeScript compartidos
│   └── config/       # eslint, tsconfig base

## Modelo de datos — PostgreSQL
Tablas: users, posts, routes, comments, subscriptions, notifications

users:        id (uuid PK), username, email, avatar_url, bio, is_premium, created_at
posts:        id (uuid PK), user_id (FK), route_id (FK nullable), caption, media_urls (JSONB), likes_count, comments_count, created_at
routes:       id (uuid PK), user_id (FK), title, track (geometry linestring srid 4326), distance_km, duration_sec, waypoints (JSONB), recorded_at
comments:     id (uuid PK), post_id (FK), user_id (FK), body, created_at
subscriptions: id (uuid PK), user_id (FK), stripe_customer_id, stripe_sub_id, status, current_period_end
notifications: id (uuid PK), user_id (FK), type, payload (JSONB), read, created_at

Relaciones clave:
- users ||--o{ posts (un usuario publica muchos posts)
- users ||--o{ routes (un usuario graba muchas rutas)
- posts ||--o{ comments
- routes ||--o| posts (una ruta puede adjuntarse a un post, pero no es obligatorio)
- users ||--|{ subscriptions

## Schema Drizzle — patrón de referencia
import { pgTable, uuid, text, real, integer, jsonb, timestamp } from 'drizzle-orm/pg-core'
import { geometry } from 'drizzle-orm/pg-core'

export const routes = pgTable('routes', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      uuid('user_id').notNull().references(() => users.id),
  title:       text('title').notNull(),
  track:       geometry('track', { type: 'linestring', srid: 4326 }),
  distanceKm:  real('distance_km'),
  durationSec: integer('duration_sec'),
  waypoints:   jsonb('waypoints'),
  recordedAt:  timestamp('recorded_at').defaultNow(),
})

## Query geoespacial — patrón de referencia
import { sql } from 'drizzle-orm'

const nearby = await db
  .select()
  .from(routes)
  .where(sql`ST_DWithin(
    track::geography,
    ST_MakePoint(${lng}, ${lat})::geography,
    ${radiusMeters}
  )`)
  .limit(20)

## Roadmap

### Fase 1 (semanas 1–6) — Fundamentos
Setup Fastify + PostgreSQL + PostGIS, auth JWT + magic link,
CRUD usuarios y perfiles, upload fotos a R2, feed básico, app mobile con onboarding
y feed, landing web y perfiles públicos.
Incluye: **Feature A — Grabación de rutas GPS**
- expo-location para tracking GPS en background
- Guardar coordenadas → API → PostGIS (LineString)
- Mostrar la ruta grabada sobre el mapa después de finalizar

### Fase 2 — Planificación de rutas
**Feature B — Planificador de rutas con Mapbox Directions API**
- Mapa interactivo: el usuario toca para poner origen/destino/waypoints
- Opciones de ruta: más directa, sin peajes, sin autopistas, caminos secundarios
- Mostrar alternativas y que el usuario elija antes de salir
- Guardar ruta planificada en la DB (reutiliza modelo de routes con campo de tipo)
- Perfil de cálculo: driving (por defecto), con exclude=toll,motorway como filtros

### Fase 3 — Navegación Roadbook Rally
**Feature C — Navegación turn-by-turn estilo rally/roadbook**
- UI de roadbook vertical (NO mapa clásico con línea azul)
- Cada instrucción tiene 3 columnas: distancia parcial | tulip diagram | notas
- Instrucción actual: tulip grande y glanceable, distancia restante
- Lista de próximas instrucciones con scroll automático conforme avanza
- Datos de telemetría: velocidad, CAP (heading en grados), distancia total, estado GPS
- Mini-mapa opcional en una esquina
- Feedback al usuario: beep/vibración en vez de voz (pensado para moto con soporte)
- Se alimenta de la ruta planificada en Fase 2
- Mapbox Navigation SDK (@mapbox/navigation-react-native)
- Manejo de background location, pantalla activa, batería, re-cálculo si se desvía

### Pendientes transversales
- Deep linking para magic links — que al tocar el link en el correo se abra la app y autentique automáticamente
- Refresh tokens — renovación automática de sesión JWT
- Comentarios, likes, notificaciones push
- Stripe/suscripciones

## Deployment
- Local: Docker Compose para PostgreSQL, Expo Go + ngrok para mobile
- Staging: Railway (API) + Vercel preview (web) + EAS internal (mobile)
- Prod: Railway (API + PostgreSQL managed) + Vercel + EAS Build (store)
- CI/CD: GitHub Actions — lint → tsc → tests (Vitest) → deploy staging → deploy prod en merge a main

## Reglas de desarrollo
1. Siempre TypeScript estricto — nunca `any` sin justificación explícita
2. Los tipos compartidos van en packages/types, nunca duplicados entre apps
3. El schema de base de datos vive únicamente en packages/db/schema
4. Las rutas de Fastify solo validan y delegan — la lógica va en services/
5. Variables de entorno nunca hardcodeadas — siempre desde process.env con validación al arrancar
6. Commits en español, convencional: feat:, fix:, chore:, refactor:
7. Antes de crear un archivo nuevo, verificar si ya existe en la estructura del monorepo

Cuando recibas una tarea, primero indica qué archivos vas a tocar y por qué, luego implementa.

## Modo de trabajo — aprendizaje guiado
Este proyecto es también un proceso de aprendizaje de todas las tecnologías
del stack. No escribas el código completo por mí salvo que lo pida
explícitamente. En cambio:

1. Explica primero el concepto o la tecnología involucrada en la tarea,
   con suficiente contexto para entender qué vamos a hacer y por qué.
2. Muestra un ejemplo mínimo o un patrón de referencia.
3. Dame las instrucciones paso a paso para que yo lo implemente.
4. Cuando termine cada paso, espera mi confirmación antes de continuar
   con el siguiente.
5. Si me equivoco, no corrijas directamente — explícame qué salió mal
   y guíame para que yo encuentre la solución.
6. Si tengo dudas conceptuales en medio de una tarea, respóndelas antes
   de continuar con la implementación.

El objetivo es que al terminar el proyecto entienda cada decisión técnica,
no solo que el código funcione.

## Diseño
Sistema de diseño "Tierra y Musgo" definido en docs/DESIGN.md
