import { FastifyInstance } from 'fastify'
import { eq } from 'drizzle-orm'
import { users } from '@motoapp/db'
import { authenticate } from '../hooks/auth.js'

export default async function userRoutes(app: FastifyInstance) {
  // Obtener perfil propio
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

  // Actualizar perfil propio
  app.patch('/users/me', { onRequest: [authenticate] }, async (request, reply) => {
    const { username, bio, avatarUrl } = request.body as {
      username?: string
      bio?: string
      avatarUrl?: string
    }

    const updates: Record<string, string> = {}
    if (username !== undefined) updates.username = username
    if (bio !== undefined) updates.bio = bio
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl

    if (Object.keys(updates).length === 0) {
      return reply.status(400).send({ error: 'No hay campos para actualizar' })
    }

    const [updated] = await app.db
      .update(users)
      .set(updates)
      .where(eq(users.id, request.user.userId))
      .returning()

    return updated
  })

  // Ver perfil público por username
  app.get('/users/:username', async (request, reply) => {
    const { username } = request.params as { username: string }

    const [user] = await app.db
      .select({
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.username, username))
      .limit(1)

    if (!user) {
      return reply.status(404).send({ error: 'Usuario no encontrado' })
    }

    return user
  })
}

