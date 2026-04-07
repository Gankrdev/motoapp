import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export function StartAdventureButton() {
  return (
    <Pressable className="mx-6 mt-8 bg-primary rounded-2xl py-5 px-6 active:opacity-90">
      <View className="flex-row items-center justify-center gap-3">
        <Ionicons name="map-outline" size={24} color="#FAF3DD" />
        <Text className="text-slateText text-lg font-extrabold tracking-tight">
          Start New Adventure
        </Text>
      </View>
    </Pressable>
  )
}
