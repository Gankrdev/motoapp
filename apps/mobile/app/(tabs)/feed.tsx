import { View, ScrollView } from 'react-native'
import { FeedHeader } from '../../components/feed/FeedHeader'
import { StartAdventureButton } from '../../components/feed/StartAdventureButton'
import { BikeStatusCard } from '../../components/feed/BikeStatusCard'
import { LastAdventureCard } from '../../components/feed/LastAdventureCard'
import { WeatherWidget } from '../../components/feed/WeatherWidget'

export default function FeedScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <FeedHeader />
        <WeatherWidget />
        <StartAdventureButton />
        <BikeStatusCard />
        <LastAdventureCard />
      </ScrollView>
    </View>
  )
}
