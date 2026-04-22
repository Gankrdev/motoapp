import * as TaskManager from 'expo-task-manager'
import type { LocationObject } from 'expo-location'
import { useRouteStore } from '../stores/route-store'
import { LOCATION_TASK_NAME } from './location-task-name'


TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.log('[location-task] error:', error)
        return
    }
    if (!data) return

    const { locations } = data as { locations: LocationObject[] }
    const addCoord = useRouteStore.getState().addCoord
    for (const loc of locations) {
        addCoord([loc.coords.longitude, loc.coords.latitude])
    }
})
