import { Pressable, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'

export function RecordTabButton({ onPress }: BottomTabBarButtonProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <Pressable
        onPress={onPress}
        className="-mt-8 h-16 w-16 items-center justify-center rounded-full bg-accent"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={32} color="#1A1C18" />
      </Pressable>
    </View>
  )
}
