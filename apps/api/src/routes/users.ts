import { FastifyInstance } from 'fastify'
import { eq } from 'drizzle-orm'
import { users } from '@motoapp/db'
import { authenticate } from '../hooks/auth.js'

export default async function userRoutes(app: FastifyInstance) {
  // Obtener perfil del usuario autenticado
  app.get('/users/me', { onRequest: [authenticate] }, async (request, reply) => {
    const [user] = await app.db
      .select()
      .from(users)
      .where(eq(users.id, request.user.userId))
      .limit(1)

    if (!user) {
      return reply.status(404).send({ error: 'Usuario no encontrado' })
    }

    return user
  })
}
