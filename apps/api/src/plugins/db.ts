import fp from 'fastify-plugin'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from '@motoapp/db'

async function dbPlugin(app) {
  const client = postgres(process.env.DATABASE_URL!)
  const db = drizzle(client, { schema })

  app.decorate('db', db)

  app.addHook('onClose', async () => {
    await client.end()
  })
}

export default fp(dbPlugin, { name: 'db' })

