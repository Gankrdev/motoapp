import { pgTable, uuid, text, boolean, timestamp, jsonb, integer, real } from 'drizzle-orm/pg-core'
import { geometry } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id:         uuid('id').primaryKey().defaultRandom(),
  username:   text('username').notNull().unique(),
  email:      text('email').notNull().unique(),
  avatarUrl:  text('avatar_url'),
  bio:        text('bio'),
  motoTypes:  jsonb('moto_types').$type<string[]>(),
  isPremium:  boolean('is_premium').default(false).notNull(),
  createdAt:  timestamp('created_at').defaultNow().notNull(),
})

export const posts = pgTable('posts', {
  id:            uuid('id').primaryKey().defaultRandom(),
  userId:        uuid('user_id').notNull().references(() => users.id),
  routeId:       uuid('route_id').references(() => routes.id),
  caption:       text('caption'),
  mediaUrls:     jsonb('media_urls').$type<string[]>(),
  likesCount:    integer('likes_count').default(0).notNull(),
  commentsCount: integer('comments_count').default(0).notNull(),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
})

export const routes = pgTable('routes', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      uuid('user_id').notNull().references(() => users.id),
  title:       text('title').notNull(),
  track:       geometry('track', { type: 'LineString', srid: 4326 }),
  distanceKm:  real('distance_km'),
  durationSec: integer('duration_sec'),
  waypoints:   jsonb('waypoints').$type<{ lat: number; lng: number; label?: string }[]>(),
  recordedAt:  timestamp('recorded_at').defaultNow().notNull(),
  maxSpeedKmh: real('max_speed_kmh'),
  avgSpeedKmh: real('avg_speed_kmh'),
})

export const comments = pgTable('comments', {
  id:        uuid('id').primaryKey().defaultRandom(),
  postId:    uuid('post_id').notNull().references(() => posts.id),
  userId:    uuid('user_id').notNull().references(() => users.id),
  body:      text('body').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const subscriptions = pgTable('subscriptions', {
  id:               uuid('id').primaryKey().defaultRandom(),
  userId:           uuid('user_id').notNull().references(() => users.id),
  stripeCustomerId: text('stripe_customer_id').notNull(),
  stripeSubId:      text('stripe_sub_id').notNull(),
  status:           text('status').notNull(),  // 'active' | 'canceled' | 'past_due' | 'trialing'
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  createdAt:        timestamp('created_at').defaultNow().notNull(),
})

export const notifications = pgTable('notifications', {
  id:        uuid('id').primaryKey().defaultRandom(),
  userId:    uuid('user_id').notNull().references(() => users.id),
  type:      text('type').notNull(),
  payload:   jsonb('payload').$type<Record<string, unknown>>(),
  read:      boolean('read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const magicLinks = pgTable('magic_links', {
  id:        uuid('id').primaryKey().defaultRandom(),
  email:     text('email').notNull(),
  token:     text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt:    timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
