import { create } from 'zustand'
import { requestForegroundPermissionsAsync, Accuracy, startLocationUpdatesAsync, stopLocationUpdatesAsync, requestBackgroundPermissionsAsync, } from 'expo-location'
import { LOCATION_TASK_NAME } from '../lib/location-task-name'

interface RouteState {
    // datos
    isRecording: boolean
    coords: [number, number][]

    // acciones
    addCoord: (coord: [number, number]) => void
    startRecording: () => Promise<void>
    stopRecording: () => Promise<void>
}

export const useRouteStore = create<RouteState>((set, get) => ({
    isRecording: false,
    coords: [],

    addCoord: (coord) => set((state) => ({ coords: [...state.coords, coord] })),
    startRecording: async () => {
        const fg = await requestForegroundPermissionsAsync()

        if (fg.status !== 'granted') {
            // manejar error — por ahora puedes lanzar o loggear
            console.log('Permiso foreground denegado');
            return
        }
        const bg = await requestBackgroundPermissionsAsync()

        if (bg.status !== 'granted') {
            // manejar error — por ahora puedes lanzar o loggear
            console.log('Permiso background denegado');
            return
        }

        set({ isRecording: true, coords: [] })

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
        set({ isRecording: false })
    },

}))