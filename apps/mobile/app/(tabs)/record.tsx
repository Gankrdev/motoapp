import { useEffect, useState, useRef } from 'react'
import { View, Text, Pressable } from 'react-native'
import * as Location from 'expo-location'
import Mapbox from '@rnmapbox/maps'
import {Ionicons} from '@expo/vector-icons'
import { useRouteStore } from '../../stores/route-store'
import { useToastStore } from '../../stores/toast-store'
import { usePostRoute } from '../../hooks/use-post-route'

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN!)

export default function RecordScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const isRecording = useRouteStore((state) => state.isRecording)
  const coords = useRouteStore((state) => state.coords)
  const startRecording = useRouteStore((state) => state.startRecording)
  const stopRecording = useRouteStore((state) => state.stopRecording)
  const [permissionMessage, setPermissionMessage] = useState('')
  const cameraRef = useRef<Mapbox.Camera>(null)

  useEffect(() => {
    let cancelled = false
    let retryTimer: ReturnType<typeof setTimeout> | null = null
    let toastShown = false
    let attempts = 0
    const MAX_ATTEMPTS = 2

    async function intentarPermiso() {
      if (cancelled) return
      attempts += 1
      const result = await Location.requestForegroundPermissionsAsync()
      if (cancelled) return
      if (result.status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({})
        if (cancelled) return
        setLocation(loc)
        cameraRef.current?.setCamera({
          centerCoordinate: [loc.coords.longitude, loc.coords.latitude],
          zoomLevel: 15,
          heading: 0,
          animationDuration: 800,
        })
        setPermissionMessage('')
        return
      }
      if (!toastShown) {
        useToastStore.getState().show('error', 'Necesitamos permiso de ubicación.')
        toastShown = true
      }
      if (!result.canAskAgain || attempts >= MAX_ATTEMPTS) {
        setPermissionMessage('Ve a Ajustes para habilitar la ubicación.')
        return
      }
      setPermissionMessage('Autoriza la ubicación para continuar')
      retryTimer = setTimeout(intentarPermiso, 3000)
    }

    intentarPermiso()
    return () => {
      cancelled = true
      if (retryTimer) clearTimeout(retryTimer)
    }
  }, [])

  const postRoute = usePostRoute()
  const clearCoords = useRouteStore((s) => s.clearCoords)

  const handlePress = async () => {
    try {
      if (isRecording) {
        const coords = await stopRecording()
        if (coords.length < 2) {
          useToastStore.getState().show('error', 'Ruta muy corta para guardar')
          clearCoords()
          return
        }
        postRoute.mutate(
          {
            title: `Ruta ${new Date().toLocaleString('es-CL')}`,
            track: { type: 'LineString', coordinates: coords },
          },
          {
            onSuccess: () => {
              useToastStore.getState().show('success', 'Ruta guardada')
              clearCoords()
            },
          }
        )
      } else {
        await startRecording()
      }
    } catch (e) {
      useToastStore.getState().show('error', (e as Error).message)
    }
  }

  return (
    <View className="flex-1">
      <Mapbox.MapView
        style={{ flex: 1 }}
        styleURL="mapbox://styles/mapbox/dark-v11"
      >
        <Mapbox.Camera
          ref={cameraRef}
          defaultSettings={{ centerCoordinate: [0, 0], zoomLevel: 1 }}
        />

        <Mapbox.LocationPuck puckBearingEnabled puckBearing="heading" />
        {coords.length >= 2 && (
          <Mapbox.ShapeSource
            id="route-source"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: coords,
              },
              properties: {},
            }}
          >
            <Mapbox.LineLayer
              id="route-line"
              style={{
                lineColor: '#D63A2A',
                lineWidth: 4,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </Mapbox.ShapeSource>
        )}
      </Mapbox.MapView>
      <Pressable
        className="absolute bottom-12 right-4 bg-card px-4 py-3 rounded-full"
        onPress={() => {
          if (!location) return
          cameraRef.current?.setCamera({
            centerCoordinate: [location.coords.longitude, location.coords.latitude],
            zoomLevel: 15,
            heading: 0,
            animationDuration: 600
          })
        }}
      >
        <Ionicons name="locate" size={22} color="#FAF3DD" />
      </Pressable>
      <Pressable
        onPress={() => handlePress()}
        className="absolute bottom-10 self-center px-8 py-4 rounded-full"
        style={{ backgroundColor: isRecording ? '#D63A2A' : '#4A7C59' }}
      >
        <Text className="text-slateText text-lg font-bold">
          {isRecording ? 'Detener' : 'Iniciar grabación'}
        </Text>
      </Pressable>
      {isRecording && (
        <View className="absolute top-12 self-center bg-card px-4 py-2 rounded-full">
          <Text className="text-slateText">{coords.length} puntos</Text>
        </View>
      )}
      {permissionMessage !== '' && (
        <View className="absolute top-12 self-center bg-card px-6 py-3 rounded-full">
          <Text className="text-slateText">{permissionMessage}</Text>
        </View>
      )}
    </View>
  )
}
