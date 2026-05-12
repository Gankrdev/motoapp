import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api-client'

type GeoJSONLineString = {
  type: 'LineString'
  coordinates: [number, number][]
}

type CreateRouteInput = {
  title: string
  track: GeoJSONLineString
  durationSec?: number
}

type Route = {
  id: string
  userId: string
  title: string
  track: GeoJSONLineString
  distanceKm: number
  durationSec: number | null
  recordedAt: string
}

export function usePostRoute() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateRouteInput) =>
      api<Route>('/routes', { method: 'POST', body: input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['routes'] })
    },
  })
}
