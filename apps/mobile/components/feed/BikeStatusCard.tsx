import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const FUEL_PERCENT = 78
const SERVICE_PERCENT = 65

export function BikeStatusCard() {
  return (
    <View className="mx-6 mt-8">
      {/* Título + badge del modelo */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-extrabold text-slateText tracking-tight">
          Bike Status
        </Text>
        <View className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
          <Text className="text-[10px] font-bold text-primaryLight uppercase tracking-wider">
            Scrambler 1200
          </Text>
        </View>
      </View>

      {/* Card */}
      <View className="bg-card rounded-2xl p-6 border border-white/5">
        {/* Fuel level */}
        <View>
          <View className="flex-row justify-between items-end">
            <View className="flex-row items-center gap-2.5">
              <View className="bg-accent/10 p-2 rounded-lg">
                <Ionicons name="water-outline" size={20} color="#FFB74D" />
              </View>
              <Text className="text-xs font-extrabold uppercase tracking-widest text-secondaryText">
                Fuel Level
              </Text>
            </View>
            <Text className="text-2xl font-black text-slateText">
              {FUEL_PERCENT}%
            </Text>
          </View>

          {/* Barra de progreso */}
          <View className="h-2.5 w-full rounded-full bg-background overflow-hidden mt-3">
            <View
              className="h-full rounded-full bg-accent"
              style={{ width: `${FUEL_PERCENT}%` }}
            />
          </View>

          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-[10px] font-bold text-secondaryText uppercase tracking-widest">
              Est. Range
            </Text>
            <Text className="text-[10px] font-extrabold text-primaryLight uppercase">
              240 km remaining
            </Text>
          </View>
        </View>

        {/* Grid 2x2: Tires y Service */}
        <View className="flex-row gap-4 mt-6">
          {/* Tires */}
          <View className="flex-1 bg-background/40 rounded-xl p-4 border border-white/5">
            <Text className="text-[10px] font-bold text-secondaryText uppercase tracking-widest">
              Tires
            </Text>
            <Text className="text-xl font-black text-slateText tracking-tight mt-2">
              32 <Text className="text-secondaryText/30 font-medium">/</Text> 36
            </Text>
            <View className="flex-row items-center gap-1.5 mt-1.5">
              <View className="w-1.5 h-1.5 rounded-full bg-success" />
              <Text className="text-[10px] font-bold text-success uppercase">
                Optimal
              </Text>
            </View>
          </View>

          {/* Service */}
          <View className="flex-1 bg-background/40 rounded-xl p-4 border border-white/5">
            <Text className="text-[10px] font-bold text-secondaryText uppercase tracking-widest">
              Service
            </Text>
            <View className="flex-row items-end gap-1 mt-2">
              <Text className="text-xl font-black text-slateText">1,240</Text>
              <Text className="text-[10px] font-bold text-secondaryText mb-1">
                km
              </Text>
            </View>
            <View className="w-full h-1.5 rounded-full bg-background overflow-hidden mt-1">
              <View
                className="h-full rounded-full bg-primary"
                style={{ width: `${SERVICE_PERCENT}%` }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
