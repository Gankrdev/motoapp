import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '@motoapp/db'

declare module 'fastify' {
  interface FastifyInstance {
    db: PostgresJsDatabase<typeof schema>
  }
}
