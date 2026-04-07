import { eq, desc } from 'drizzle-orm'
import { posts, users, Database } from '@motoapp/db'

export async function createPost(db: Database, userId: string, caption: string, mediaUrls?: string[]) {
  const [post] = await db
    .insert(posts)
    .values({ userId, caption, mediaUrls })
    .returning()

  return post
}

export async function getFeed(db: Database, limit: number, offset: number) {
  return db
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
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset)
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
