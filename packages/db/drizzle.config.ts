import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  extensionsFilters: ['postgis'],   // <-- añade esto
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgresql://motoapp:motoapp_dev@localhost:5432/motoapp',
  },
})
