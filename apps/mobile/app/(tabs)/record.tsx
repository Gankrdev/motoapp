import { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, Pressable } from 'react-native'
import * as Location from 'expo-location'
import Mapbox from '@rnmapbox/maps'

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN!)

export default function RecordScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [isRecording, setIsRecording] = useState(false)
  const [coords, setCoords] = useState<[number, number][]>([])


  useEffect(() => {
    async function getLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado')
        return
      }
      const loc = await Location.getCurrentPositionAsync({})
      setLocation(loc)
    }
    getLocation()
  }, [])

  useEffect(() => {
    if (!isRecording) return  // si no estamos grabando, no hagas nada

    setCoords([])  // reset: cada nueva grabación empieza limpia

    let subscription: Location.LocationSubscription | null = null

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 5,
      },
      (loc) => {
        setCoords(prev => [...prev, [loc.coords.longitude, loc.coords.latitude]])
      }
    ).then(sub => {
      subscription = sub
    })

    return () => {
      subscription?.remove()
    }
  }, [isRecording])


  if (errorMsg) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-primaryLight text-lg">{errorMsg}</Text>
      </View>
    )
  }

  if (!location) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#4A7C59" />
        <Text className="text-primaryLight mt-4">Obteniendo ubicación...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1">
      <Mapbox.MapView
        style={{ flex: 1 }}
        styleURL="mapbox://styles/mapbox/dark-v11"
      >
        <Mapbox.Camera
          centerCoordinate={[location.coords.longitude, location.coords.latitude]}
          zoomLevel={14}
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
        onPress={() => setIsRecording(!isRecording)}
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

    </View>
  )
}
