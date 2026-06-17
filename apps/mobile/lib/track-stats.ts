const EARTH_RADIUS_KM = 6371

function toRad(deg: number): number {
    return (deg * Math.PI) / 180
}

function haversineKm(
    [lng1, lat1]: [number, number],
    [lng2, lat2]: [number, number]
): number {
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return EARTH_RADIUS_KM * c
}

export function calculateDistanceKm(coords: [number, number][]): number {
    let distance = 0
    for (let i = 1; i < coords.length; i++) {
        distance += haversineKm(coords[i - 1], coords[i])
    }
    return distance
}

export function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return [h, m, s]
        .map((v) => v.toString().padStart(2, '0'))
        .join(':')
}

export function calculateAvgSpeedKmh(distanceKm: number, durationSec: number): number {
    if (durationSec === 0) return 0
    return (distanceKm / durationSec) * 3600
}