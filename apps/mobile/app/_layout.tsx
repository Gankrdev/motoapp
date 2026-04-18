import "../global.css"
import { useState, useEffect } from 'react'
import { Stack, useSegments, router } from 'expo-router'
import { useAuthStore } from '../stores/auth-store'
import { ToastHost } from "../components/ToastHost"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { queryClient, persister } from '../lib/query-client'


export default function RootLayout() {
  const { isAuthenticated, isNewUser, loadToken } = useAuthStore()
  const segments = useSegments()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    loadToken().then(() => setIsReady(true))
  }, [])

  useEffect(() => {
    if (!isReady) return

    const inAuthGroup = segments[0] === '(auth)'

    if (isAuthenticated && isNewUser && !inAuthGroup) {
      router.replace('/(auth)/welcome')
    } else if (isAuthenticated && !isNewUser && inAuthGroup) {
      router.replace('/(tabs)/feed')
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login')
    }

  }, [isAuthenticated, isNewUser, segments, isReady])

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <ToastHost />
      </SafeAreaProvider>
    </PersistQueryClientProvider>
  )
}
