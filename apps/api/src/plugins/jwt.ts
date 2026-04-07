import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'
import { FastifyInstance } from 'fastify'

async function jwtPlugin(app: FastifyInstance) {
  app.register(jwt, {
    secret: process.env.JWT_SECRET!,
  })
}

export default fp(jwtPlugin, { name: 'jwt' })
