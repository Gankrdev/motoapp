import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { S3Client } from '@aws-sdk/client-s3'
import * as schema from '@motoapp/db'

declare module 'fastify' {
  interface FastifyInstance {
    db: PostgresJsDatabase<typeof schema>
    s3: S3Client
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: string }
    user: { userId: string }
  }
}
