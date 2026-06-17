import { FastifyInstance } from 'fastify'
import { authenticate } from '../hooks/auth.js'
import { createRoute } from '../services/routes.js'

type GeoJSONLineString = {
    type: 'LineString'
    coordinates: [number, number][]
}

export default async function routeRoutes(app: FastifyInstance) {
    app.post('/routes', { onRequest: [authenticate] }, async (request, reply) => {
        const { title, track, durationSec, distanceKm } = request.body as {
            title: string
            track: GeoJSONLineString
            durationSec?: number
            distanceKm?: number
        }

        // Validaciones — devuelven 400 si algo falla
        if (!title || typeof title !== 'string') {
            return reply.status(400).send({ error: 'title es requerido' })
        }
        if (!track || track.type !== 'LineString') {
            return reply.status(400).send({ error: 'track debe ser un GeoJSON LineString' })
        }
        if (!Array.isArray(track.coordinates) || track.coordinates.length < 2) {
            return reply.status(400).send({ error: 'track debe tener al menos 2 puntos' })
        }
        if (distanceKm !== undefined && (!Number.isFinite(distanceKm) || distanceKm < 0)) {
            return reply.status(400).send({ error: 'distanceKm debe ser un número' })
        }

        const route = await createRoute(app.db, request.user.userId, {
            title,
            track,
            durationSec,
            distanceKm,
        })

        return reply.status(201).send(route)
    })
}