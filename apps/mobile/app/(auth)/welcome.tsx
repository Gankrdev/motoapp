import { useRef, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  ImageBackground,
  ScrollView,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

const BG_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDbeD8MSPbiXwIUJFGOTGsP5SV8fpQsPlILQMXuMbQ8Cs7VkhOrgHfYEDM7V9tmGj7D0n24ADHKolVer_9yTp5mWyQ9VyWuPaidE1-BcLSu0ymIth1sEpQMadreYc1Nc1kKvQKZnn4irD9gIhITwFz-gCmAGw25oePcpyyGhDFjqzIrBmASCJ2AoM_7ktcJr4r_KSnv4MM8rJMAXZXUri5OuCYSck26GDISzbVvb7UePmGZeRlybMWqOMF7fBwjFTodfMCo5ifvmW4D'

const PAGES = [
  {
    title: 'Ride the ',
    highlight: 'Unknown',
    body: 'Discover hidden routes, track your rides, and connect with riders in the ultimate motorcycle community.',
  },
  {
    title: 'Record Every ',
    highlight: 'Mile',
    body: 'Track your routes with GPS precision. Save distance, duration, and waypoints from every adventure.',
  },
  {
    title: 'Join the ',
    highlight: 'Pack',
    body: 'Share your rides, follow other riders, and find the best routes near you. The road is better together.',
  },
]

export default function WelcomeScreen() {
  const { width } = useWindowDimensions()
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<ScrollView>(null)
  const cardPadding = 48 // p-6 = 24px each side
  const pageWidth = width - 32 // px-4 = 16px each side

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / (pageWidth - cardPadding))
    setActiveIndex(index)
  }

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} className="flex-1">
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(26,28,24,0.95)']}
        locations={[0, 0.4, 1]}
        className="flex-1"
      >
        <View className="flex-1 justify-between pt-14 pb-8 px-4">
          {/* Top: Logo */}
          <View className="items-center">
            <View className="w-20 h-20 rounded-full bg-[#1a1c18]/40 justify-center items-center mb-4">
              <MaterialCommunityIcons name="motorbike" size={36} color="#C7A44D" />
            </View>
            <Text className="text-xl font-extrabold tracking-[4px] text-[#FAF3DD] uppercase">
              Moto<Text className="text-[#C7A44D]">Trek</Text>
            </Text>
          </View>

          {/* Bottom: Card */}
          <View className="w-full max-w-md self-center">
            <View className="items-center rounded-3xl bg-[#1a1c18]/90 p-6 pt-8">
              {/* Swipeable pages */}
              <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={{ width: pageWidth - cardPadding }}
              >
                {PAGES.map((page, i) => (
                  <View key={i} style={{ width: pageWidth - cardPadding }} className="items-center">
                    <Text className="text-center text-3xl font-extrabold leading-tight text-[#FAF3DD] mb-3">
                      {page.title}<Text className="text-primary">{page.highlight}</Text>
                    </Text>
                    <Text className="text-center text-base font-normal leading-relaxed text-gray-300 px-2">
                      {page.body}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              {/* Page Indicators */}
              <View className="flex-row items-center justify-center gap-3 mt-8 mb-8">
                {PAGES.map((_, i) => (
                  <View
                    key={i}
                    className={`h-1.5 rounded-full ${
                      i === activeIndex
                        ? 'w-10 bg-primary'
                        : 'w-1.5 bg-[#FAF3DD]/30'
                    }`}
                  />
                ))}
              </View>

              {/* Button */}
              <Pressable
                className="w-full flex-row items-center justify-center gap-2 rounded-2xl bg-primary active:bg-primary-dark active:scale-[0.98] h-14"
                onPress={() => {
                  if (activeIndex < PAGES.length - 1) {
                    const next = activeIndex + 1
                    scrollRef.current?.scrollTo({ x: (pageWidth - cardPadding) * next, animated: true })
                  } else {
                    router.push('/(auth)/moto-type')
                  }
                }}
              >
                <Text className="text-[#FAF3DD] text-lg font-bold">
                  {activeIndex < PAGES.length - 1 ? 'Next' : 'Get Started'}
                </Text>
                <MaterialIcons name="arrow-forward" size={20} color="#FAF3DD" />
              </Pressable>

              {/* Log In link */}
              <View className="mt-6 mb-2">
                <Text className="text-sm font-medium text-gray-400">
                  Already have an account?{' '}
                  <Text
                    className="text-[#C7A44D] font-semibold"
                    onPress={() => router.replace('/(auth)/login')}
                  >
                    Log In
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  )
}
