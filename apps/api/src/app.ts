import Fastify from 'fastify'
import dbPlugin from './plugins/db.js'
import jwtPlugin from './plugins/jwt.js'
import authRoutes from './routes/auth.js'

export function buildApp() {
  const app = Fastify({
    logger: true,
  })

  app.register(dbPlugin)
  app.register(jwtPlugin)
  app.register(authRoutes)

  app.get('/health', async () => {
    return { status: 'ok' }
  })

  return app
}
