import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const WEATHER = {
  temperature: 22,
  condition: 'Mostly Sunny',
  city: 'San Francisco',
  updatedAgo: '5m ago',
  rainChance: 12,
}

export function WeatherWidget() {
  return (
    <View className="mx-6 -mt-8 bg-card rounded-2xl p-6 border border-white/5">
      {/* Fila principal: temperatura + ciudad */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-4">
          <View className="bg-info/20 p-3 rounded-2xl">
            <Ionicons name="partly-sunny" size={32} color="#6B8FA8" />
          </View>
          <View>
            <Text className="text-4xl font-black text-slateText tracking-tight">
              {WEATHER.temperature}°C
            </Text>
            <Text className="text-secondaryText text-xs font-bold uppercase tracking-wider">
              {WEATHER.condition}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-xs font-extrabold text-primaryLight uppercase tracking-widest">
            {WEATHER.city}
          </Text>
          <Text className="text-[10px] text-secondaryText/60 font-medium mt-1">
            Updated {WEATHER.updatedAgo}
          </Text>
        </View>
      </View>

      {/* Rain chance */}
      <View className="flex-row items-center gap-3 mt-5">
        <Ionicons name="water" size={18} color="#6B8FA8" />
        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-1.5">
            <Text className="text-[10px] font-extrabold text-secondaryText uppercase tracking-tight">
              Rain Chance
            </Text>
            <Text className="text-xs font-bold text-info">
              {WEATHER.rainChance}%
            </Text>
          </View>
          <View className="h-1.5 w-full bg-background rounded-full overflow-hidden">
            <View
              className="h-full bg-info rounded-full"
              style={{ width: `${WEATHER.rainChance}%` }}
            />
          </View>
        </View>
      </View>
    </View>
  )
}
