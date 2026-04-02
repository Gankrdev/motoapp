import { FastifyInstance } from 'fastify'
import { authenticate } from '../hooks/auth.js'
import { createPost, getFeed, getPostById, deletePost } from '../services/posts.js'

export default async function postRoutes(app: FastifyInstance) {
    // Crear post
    app.post('/posts', { onRequest: [authenticate] }, async (request, reply) => {
        const { caption, mediaUrls } = request.body as {
            caption: string
            mediaUrls?: string[]
        }

        if (!caption) {
            return reply.status(400).send({ error: 'Caption es requerido' })
        }

        const post = await createPost(app.db, request.user.userId, caption, mediaUrls)

        return reply.status(201).send(post)
    })

    // Feed con paginación
    app.get('/posts', async (request, reply) => {
        const { limit = '20', offset = '0' } = request.query as {
            limit?: string
            offset?: string
        }

        const feed = await getFeed(app.db, Number(limit), Number(offset))

        return feed
    })

    // Ver post por ID
    app.get('/posts/:id', async (request, reply) => {
        const { id } = request.params as { id: string }

        const post = await getPostById(app.db, id)

        if (!post) {
            return reply.status(404).send({ error: 'Post no encontrado' })
        }

        return post
    })

    // Eliminar post propio
    app.delete('/posts/:id', { onRequest: [authenticate] }, async (request, reply) => {
        const { id } = request.params as { id: string }

        const post = await getPostById(app.db, id)

        if (!post) {
            return reply.status(404).send({ error: 'Post no encontrado' })
        }

        if (post.author.id !== request.user.userId) {
            return reply.status(403).send({ error: 'No puedes eliminar este post' })
        }

        await deletePost(app.db, id, request.user.userId)

        return { message: 'Post eliminado' }
    })
}
