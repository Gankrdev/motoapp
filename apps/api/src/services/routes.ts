import { sql } from 'drizzle-orm'
import { Database } from '@motoapp/db'

type GeoJSONLineString = {
    type: 'LineString'
    coordinates: [number, number][]
}

interface CreateRouteInput {
    title: string
    track: GeoJSONLineString
    durationSec?: number
    distanceKm?: number
}

export async function createRoute(
    db: Database,
    userId: string,
    input: CreateRouteInput,
) {
    const trackJson = JSON.stringify(input.track)

    const result = await db.execute(sql`
    INSERT INTO routes (user_id, title, track, duration_sec, distance_km)
    VALUES (
      ${userId}::uuid,
      ${input.title},
      ST_GeomFromGeoJSON(${trackJson}),
      ${input.durationSec ?? null},
      ${input.distanceKm ?? null}
    )
    RETURNING
      id,
      user_id        AS "userId",
      title,
      ST_AsGeoJSON(track)::json AS track,
      (ST_Length(track::geography) / 1000)::real AS "distanceKm",
      duration_sec   AS "durationSec",
      recorded_at    AS "recordedAt"
  `)

    return result[0]
}
