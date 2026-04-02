import { FastifyInstance } from 'fastify'
import { authenticate } from '../hooks/auth.js'
import { uploadFile } from '../services/storage.js'

export default async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', { onRequest: [authenticate] }, async (request, reply) => {
    const file = await request.file()

    if (!file) {
      return reply.status(400).send({ error: 'No se envió ningún archivo' })
    }

    const buffer = await file.toBuffer()
    const key = await uploadFile(app.s3, buffer, file.mimetype)

    return { key }
  })
}

