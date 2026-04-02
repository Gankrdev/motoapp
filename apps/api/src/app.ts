import Fastify from 'fastify'
import dbPlugin from './plugins/db.js'
import jwtPlugin from './plugins/jwt.js'
import storagePlugin from './plugins/storage.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import uploadRoutes from './routes/upload.js'

export function buildApp() {
  const app = Fastify({
    logger: true,
  })

  app.register(dbPlugin)
  app.register(jwtPlugin)
  app.register(storagePlugin)
  app.register(authRoutes)
  app.register(userRoutes)
  app.register(uploadRoutes)

  app.get('/health', async () => {
    return { status: 'ok' }
  })

  return app
}
