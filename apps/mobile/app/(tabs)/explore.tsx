import { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import * as Location from 'expo-location'
import Mapbox from '@rnmapbox/maps'

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN!)

export default function RecordScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

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
      </Mapbox.MapView>
    </View>
  )
}
