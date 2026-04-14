import { create } from 'zustand'
import { LocationSubscription, watchPositionAsync, requestForegroundPermissionsAsync, Accuracy } from 'expo-location'

interface RouteState {
    // datos
    isRecording: boolean
    coords: [number, number][]
    subscription: LocationSubscription | null

    // acciones
    addCoord: (coord: [number, number]) => void
    startRecording: () => Promise<void>
    stopRecording: () => void
}

export const useRouteStore = create<RouteState>((set, get) => ({
    isRecording: false,
    coords: [],
    subscription: null,

    addCoord: (coord) => set((state) => ({ coords: [...state.coords, coord] })),
    startRecording: async () => {
        const { status } = await requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            // manejar error — por ahora puedes lanzar o loggear
            console.log('Permiso de ubicación denegado');

            return
        }

        set({ isRecording: true, coords: [] })

        const subscription = await watchPositionAsync(
            {
                accuracy: Accuracy.BestForNavigation,
                timeInterval: 1000,
                distanceInterval: 5,
            },
            (loc) => {
                get().addCoord([loc.coords.longitude, loc.coords.latitude])
            }
        )

        set({ subscription })
    },

    stopRecording: () => {
        const { subscription } = get()
        subscription?.remove()
        set({ isRecording: false, subscription: null })
    },

}))