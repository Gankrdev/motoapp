import { eq, desc } from 'drizzle-orm'
import { posts, users, routes, Database } from '@motoapp/db'

type CreatePostInput = {
  caption: string
  routeId?: string
  mediaUrls?: string[]
}

export async function createPost(db: Database, userId: string, input: CreatePostInput) {
  const [post] = await db
    .insert(posts)
    .values({ userId, ...input })
    .returning()

  return post
}

export async function getFeed(db: Database, limit: number, offset: number) {
  const rows = await db
    .select({
      id: posts.id,
      caption: posts.caption,
      mediaUrls: posts.mediaUrls,
      likesCount: posts.likesCount,
      commentsCount: posts.commentsCount,
      createdAt: posts.createdAt,
      author: {
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarUrl,
      },
      route: {
        id: routes.id,
        distanceKm: routes.distanceKm,
        durationSec: routes.durationSec,
      },
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .leftJoin(routes, eq(posts.routeId, routes.id))
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset)

  return rows.map((row) => ({
    ...row,
    route: row.route?.id ? row.route : null,
  }))
}

export async function getPostById(db: Database, id: string) {
  const [post] = await db
    .select({
      id: posts.id,
      caption: posts.caption,
      mediaUrls: posts.mediaUrls,
      likesCount: posts.likesCount,
      commentsCount: posts.commentsCount,
      createdAt: posts.createdAt,
      author: {
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.id, id))
    .limit(1)

  return post ?? null
}

export async function deletePost(db: Database, id: string, userId: string) {
  const [deleted] = await db
    .delete(posts)
    .where(eq(posts.id, id))
    .returning()

  return deleted ?? null
}
