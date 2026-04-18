import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useToastStore } from '../stores/toast-store'
import { ApiError } from './api-client'

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (err) => {
            // No mostrar 401/403: redirigen a login, no es un error "del usuario"
            if (err instanceof ApiError && (err.status === 401 || err.status === 403)) return
            useToastStore.getState().show('error', (err as Error).message)
        },
    }),
    mutationCache: new MutationCache({
        onError: (err) => {
            if (err instanceof ApiError && (err.status === 401 || err.status === 403)) return
            useToastStore.getState().show('error', (err as Error).message)
        },
    }),
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60,       // 1 min: considera fresco; no refetchea sin necesidad
            gcTime: 1000 * 60 * 60 * 24, // 24h: tiempo que la cache sobrevive tras quedar inactiva
            retry: (failureCount, err) => {
                // No reintentar si es 4xx — es un error de cliente
                if (err instanceof ApiError && err.status >= 400 && err.status < 500) return false
                return failureCount < 2
            },
        },
    },
})

export const persister = createAsyncStoragePersister({
    storage: AsyncStorage,
    key: 'motoapp-query-cache',
})
