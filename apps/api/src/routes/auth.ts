import { FastifyInstance } from 'fastify'
import { createMagicLink, verifyMagicLink, findOrCreateUser } from '../services/auth.js'

export default async function authRoutes(app: FastifyInstance) {
  // Solicitar magic link
  app.post('/auth/magic-link', async (request, reply) => {
    const { email } = request.body as { email: string }

    if (!email) {
      return reply.status(400).send({ error: 'Email es requerido' })
    }

    const token = await createMagicLink(app.db, email)

    // En desarrollo, devolvemos el token directamente
    // En producción, aquí se enviaría el email
    app.log.info(`Magic link token para ${email}: ${token}`)

    return { message: 'Magic link enviado a tu email' }
  })

  // Verificar token y obtener JWT
  app.post('/auth/verify', async (request, reply) => {
    const { token } = request.body as { token: string }

    if (!token) {
      return reply.status(400).send({ error: 'Token es requerido' })
    }

    const link = await verifyMagicLink(app.db, token)

    if (!link) {
      return reply.status(401).send({ error: 'Token inválido o expirado' })
    }

    const user = await findOrCreateUser(app.db, link.email)
    const jwt = app.jwt.sign({ userId: user.id }, { expiresIn: '7d' })

    return { token: jwt, user }
  })

}
