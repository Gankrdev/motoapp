import { randomBytes } from 'crypto'
import { eq, and, isNull, gt } from 'drizzle-orm'
import { magicLinks, users } from '@motoapp/db'
import {  Database } from '@motoapp/db'

export async function createMagicLink(db: Database, email: string) {
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    await db.insert(magicLinks).values({
        email,
        token,
        expiresAt,
    })

    return token
}

export async function verifyMagicLink(db: Database, token: string) {
    const [link] = await db
        .select()
        .from(magicLinks)
        .where(
            and(
                eq(magicLinks.token, token),
                isNull(magicLinks.usedAt),
                gt(magicLinks.expiresAt, new Date())
            )
        )
        .limit(1)

    if (!link) return null

    // Marcar como usado
    await db
        .update(magicLinks)
        .set({ usedAt: new Date() })
        .where(eq(magicLinks.id, link.id))
    return link
}

export async function findOrCreateUser(db: Database, email: string) {
    const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

    console.log('existing:', existing)

    if (existing) return { user: existing, isNewUser: false }

    const username = email.split('@')[0]


    const result = await db
        .insert(users)
        .values({ email, username })
        .returning()

    return { user: result[0], isNewUser: true }
}

