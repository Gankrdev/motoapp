import simplify from 'simplify-js'

const TOLERANCE_DEG = 0.00009 // ~10m a latitudes de Chile

export function simplifyTrack(
  coords: [number, number][]
): [number, number][] {
  if (coords.length < 3) return coords

  const points = coords.map(([lng, lat]) => ({ x: lng, y: lat }))
  const simplified = simplify(points, TOLERANCE_DEG, true)
  return simplified.map((p) => [p.x, p.y])
}
