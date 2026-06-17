import { create } from "zustand";

export type RouteSource = 'recorded' | 'imported' | 'planned'

interface PendingRouteState {
    coords: [number, number][]
    durationSec: number | null
    source: RouteSource | null
    suggestedTitle: string | null

    // acciones
    setPendingRoute: (data: {
        coords: [number, number][],
        durationSec: number | null,
        source: RouteSource,
        suggestedTitle: string
    }) => void
    clear: () => void
}

export const usePendingRouteStore = create<PendingRouteState>((set) => ({
    coords: [],
    durationSec: null,
    source: null,
    suggestedTitle: null,

    setPendingRoute: ({ coords, durationSec, source, suggestedTitle }) =>
        set({ coords, durationSec, source, suggestedTitle }),
    clear: () =>
        set({ coords: [], durationSec: null, source: null, suggestedTitle: null }),
}))