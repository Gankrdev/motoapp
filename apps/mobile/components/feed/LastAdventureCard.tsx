import { View, Text, ImageBackground, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const ADVENTURE = {
  routeName: 'Skyline Loop',
  location: 'Virginia Blue Ridge',
  duration: '3h 12m',
  distance: '124 km',
  date: 'Aug 24, 2023',
  imageUrl:
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
}

export function LastAdventureCard() {
  return (
    <View className="mx-6 mt-8">
      <Text className="text-lg font-extrabold text-slateText tracking-tight mb-4">
        Last Adventure
      </Text>

      <View className="bg-card rounded-2xl overflow-hidden border border-white/5">
        {/* Imagen de fondo */}
        <ImageBackground
          source={{ uri: ADVENTURE.imageUrl }}
          className="h-32 w-full"
        >
          <View className="flex-1 bg-background/40">
            <View className="absolute bottom-3 left-3 bg-card/90 px-3 py-1 rounded-lg border border-white/10">
              <Text className="text-[10px] font-black text-slateText uppercase tracking-tight">
                {ADVENTURE.routeName}
              </Text>
            </View>
          </View>
        </ImageBackground>

        {/* Información de la ruta */}
        <View className="p-5 flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-sm font-extrabold text-slateText">
                {ADVENTURE.location}
              </Text>
              <Text className="text-[10px] font-bold text-secondaryText">
                • {ADVENTURE.duration}
              </Text>
            </View>
            <View className="flex-row items-center gap-3 mt-1.5">
              <View className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded">
                <Text className="text-[10px] font-extrabold text-primaryLight uppercase tracking-wider">
                  {ADVENTURE.distance}
                </Text>
              </View>
              <Text className="text-[10px] font-bold text-secondaryText uppercase tracking-widest">
                {ADVENTURE.date}
              </Text>
            </View>
          </View>

          <Pressable className="w-10 h-10 rounded-full bg-background items-center justify-center">
            <Ionicons name="chevron-forward" size={20} color="#C4C1B1" />
          </Pressable>
        </View>
      </View>
    </View>
  )
}
