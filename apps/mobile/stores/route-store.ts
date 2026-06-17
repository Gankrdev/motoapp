import { create } from 'zustand'
import {
    getForegroundPermissionsAsync,
    requestForegroundPermissionsAsync,
    getBackgroundPermissionsAsync,
    requestBackgroundPermissionsAsync,
    Accuracy,
    startLocationUpdatesAsync,
    stopLocationUpdatesAsync,
} from 'expo-location'
import { LOCATION_TASK_NAME } from '../lib/location-task-name'

interface RouteState {
    // datos
    isRecording: boolean
    coords: [number, number][]
    startedAt: number | null
    accumulatedMs: number

    // acciones
    addCoord: (coord: [number, number]) => void
    startRecording: () => Promise<void>
    stopRecording: () => Promise<{ coords: [number, number][]; durationSec: number }>
    clearCoords: () => void

}

export const useRouteStore = create<RouteState>((set, get) => ({
    isRecording: false,
    coords: [],
    startedAt: null,
    accumulatedMs: 0,

    clearCoords: () => set({ coords: [], startedAt: null, accumulatedMs: 0 }),

    addCoord: (coord) => set((state) => ({ coords: [...state.coords, coord] })),
    startRecording: async () => {
        const fgCurrent = await getForegroundPermissionsAsync()
        const fg = fgCurrent.status === 'granted'
            ? fgCurrent
            : await requestForegroundPermissionsAsync()

        if (fg.status !== 'granted') {
            throw new Error("Necesitamos permiso de ubicación para grabar tu ruta.");
        }

        const bgCurrent = await getBackgroundPermissionsAsync()
        const bg = bgCurrent.status === 'granted'
            ? bgCurrent
            : await requestBackgroundPermissionsAsync()

        if (bg.status !== 'granted') {
            throw new Error("Activa la ubicación en modo 'Todo el tiempo' desde Ajustes para grabar con la pantalla apagada.");
        }

        set({ isRecording: true, coords: [], startedAt: Date.now(), accumulatedMs: 0 })

        await startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 5,
            showsBackgroundLocationIndicator: true,
            foregroundService: {
                notificationTitle: 'Grabando ruta',
                notificationBody: 'MotoApp está registrando tu recorrido',
                notificationColor: '#D63A2A'
            }
        })
    },

    stopRecording: async () => {
        await stopLocationUpdatesAsync(LOCATION_TASK_NAME)
        const { startedAt, accumulatedMs, coords } = get()
        const elapsed = startedAt ? Date.now() - startedAt : 0
        const durationSec = Math.floor((accumulatedMs + elapsed) / 1000)
        set({ isRecording: false, startedAt: null })
        return { coords, durationSec }
    },
}))