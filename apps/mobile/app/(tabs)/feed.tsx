import { View, Text, FlatList } from 'react-native'
import { FeedHeader } from '../../components/feed/FeedHeader'
import { StartAdventureButton } from '../../components/feed/StartAdventureButton'
import { BikeStatusCard } from '../../components/feed/BikeStatusCard'
import { LastAdventureCard } from '../../components/feed/LastAdventureCard'
import { WeatherWidget } from '../../components/feed/WeatherWidget'
import { usePosts } from '../../hooks/use-posts'
import { PostCard } from '../../components/feed/PostCard'

export default function FeedScreen() {
  const { data, isLoading, isError } = usePosts()
  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}

        ListHeaderComponent={
          <>
            <FeedHeader />
            <WeatherWidget />
            <StartAdventureButton />
            <BikeStatusCard />
          </>
        }
        ListFooterComponent={
          <LastAdventureCard />
        }
        ListEmptyComponent={
          <Text className='text-white text-center mt-8'>
            {isLoading ? 'Cargando...' : data?.length + ' posts'}
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />

    </View>
  )
}
