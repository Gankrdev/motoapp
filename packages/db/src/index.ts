export * from './schema.js'

// Tipo reutilizable para la instancia de Drizzle
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type * as schema from './schema.js'
export type Database = PostgresJsDatabase<typeof schema>
