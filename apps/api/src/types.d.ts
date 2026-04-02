import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '@motoapp/db'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '@motoapp/db'

declare module 'fastify' {
  interface FastifyInstance {
    db: PostgresJsDatabase<typeof schema>
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    db: PostgresJsDatabase<typeof schema>
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: string }
    user: { userId: string }
  }
}
