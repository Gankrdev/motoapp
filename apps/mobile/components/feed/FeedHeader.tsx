import { View, Text, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../../stores/auth-store'

export function FeedHeader() {
  const { user } = useAuthStore()
  const insets = useSafeAreaInsets()

  return (
    <View
      className="bg-background px-6 pb-14"
      style={{ paddingTop: insets.top + 16 }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          <View className="w-12 h-12 rounded-full bg-primary/30 border-2 border-white/20" />
          <View>
            <Text className="text-secondaryText text-[10px] font-bold uppercase tracking-widest">
              Good Morning
            </Text>
            <Text className="text-slateText text-2xl font-extrabold">
              Hey {user?.username ?? 'rider'}!
            </Text>
          </View>
        </View>
        <Pressable className="w-12 h-12 items-center justify-center rounded-full bg-white/5 border border-white/10">
          <Ionicons name="notifications-outline" size={22} color="#FAF3DD" />
        </Pressable>
      </View>
    </View>
  )
}
