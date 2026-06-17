import "../global.css"
import '../lib/location-task'
import { useState, useEffect } from 'react'
import { Stack, useSegments, router } from 'expo-router'
import { useAuthStore } from '../stores/auth-store'
import { ToastHost } from "../components/ToastHost"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { queryClient, persister } from '../lib/query-client'
import { KeyboardProvider } from 'react-native-keyboard-controller'

import { useFonts } from 'expo-font'
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk'
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope'

export default function RootLayout() {
  const { isAuthenticated, isNewUser, loadToken } = useAuthStore()
  const segments = useSegments()
  const [isReady, setIsReady] = useState(false)
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  })

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

  if (!isReady || !fontsLoaded) {
    return null
  }
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <SafeAreaProvider>
        <KeyboardProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="route/preview" options={{ presentation: 'modal' }} />
          </Stack>
          <ToastHost />
        </KeyboardProvider>
      </SafeAreaProvider>
    </PersistQueryClientProvider>
  )
}
