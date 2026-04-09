import { View, Text, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/auth-store';
import { LinearGradient } from 'expo-linear-gradient'

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);

  return (
    <ScrollView className='flex-1 bg-background' contentContainerStyle={{ paddingBottom: 32 }}>
      {/* SECCION: HEADER */}
      <View className='pt-12 px-4 pb-8 items-center'>
        <View className='relative mb-6'>
          <View className='w-32 h-32 rounded-full overflow-hidden bg-card border border-white/10'>
            <Image
              source={{ uri: user?.avatarUrl ?? 'https://placehold.co/128x128?text=Avatar' }}
              className='w-full h-full'
            />
          </View>
          <View className='absolute -bottom-2 -right-2 bg-primary w-10 h-10 rounded-full items-center justify-center border-2 border-background'>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
          </View>
        </View>
        <Text className='text-3xl font-bold text-slateText mb-2'>{user?.username ?? 'Usuario'}</Text>
        <View className='flex-row items-center bg-card py-1.5 px-4 rounded-full border border-white/10'>
          <Ionicons name="ribbon" size={14} color="#FFB74D" />
          <Text className='text-sm text-slateText font-medium ml-2'>Rider Veterano</Text>
        </View>
      </View>


      {/*SECCION: STATS */}
      <View className='px-4 mb-8'>
        <View className='flex-row gap-4'>
          <View className='flex-1 bg-card p-4 rounded-xl items-center'>
            <Text className='text-2xl font-bold text-accent mb-1'>12.4k</Text>
            <Text className='text-xs text-secondaryText'>Total Km</Text>
          </View>
          <View className='flex-1 bg-card p-4 rounded-xl items-center'>
            <Text className='text-2xl font-bold text-accent mb-1'>48</Text>
            <Text className='text-xs text-secondaryText'>Rutas</Text>
          </View>
          <View className='flex-1 bg-card p-4 rounded-xl items-center'>
            <Text className='text-2xl font-bold text-accent mb-1'>320h</Text>
            <Text className='text-xs text-secondaryText'>Horas</Text>
          </View>
        </View>

      </View>

      {/* SECCION: MI MOTO */}
      <View className='px-4 mb-8'>
        <Text className='text-xl font-bold text-slateText mb-4'>Mi Moto</Text>
        <View className='bg-card rounded-xl overflow-hidden'>
          <View className='h-48 relative'>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1609174470568-ac0c96458a67?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
              className='w-full h-full'
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)', '#1A1C18'] as const}
              locations={[0, 0.6, 1]}
              style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
            />

            <View className='absolute bottom-4 left-4 right-4'>
              <Text className='text-slateText text-lg font-bold'>Himalayan • 2020</Text>
              <Text className='text-secondaryText text-sm'>Royal Enfield</Text>
            </View>
          </View>

          <View className='p-4'>
            <View className='flex-row items-center justify-between py-2 border-b border-white/10'>
              <View className='flex-row items-center gap-2'>
                <Ionicons name="build" size={20} color="#FFB74D" />
                <Text className='text-slateText'>Próximo servicio</Text>
              </View>
              <Text className='text-accent font-medium'>en 1240 km</Text>
            </View>
            <View className='flex-row items-center justify-between py-2'>
              <View className='flex-row items-center gap-2'>
                <Ionicons name="speedometer" size={20} color="#FFB74D" />
                <Text className='text-slateText'>Consumo</Text>
              </View>
              <Text className='text-slateText font-medium'>4.5L/100km</Text>
            </View>
          </View>

        </View>
      </View>

      {/* SECCION: LOGROS */}
      <View className='mb-8'>
        <Text className='px-4 text-xl font-bold text-slateText mb-4'>Logros</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
        >
          <View className='w-32 bg-card p-4 rounded-xl items-center'>
            <View className='w-16 h-16 rounded-full bg-primary/20 items-center justify-center mb-3'>
              <Ionicons name="trail-sign" size={32} color="#FFB74D" />
            </View>
            <Text className='text-sm font-medium text-slateText mb-1 text-center'>Pico Alpino</Text>
            <Text className='text-xs text-secondaryText text-center'>Ascendiste 2000m</Text>
          </View>
          <View className='w-32 bg-card p-4 rounded-xl items-center'>
            <View className='w-16 h-16 rounded-full bg-primary/20 items-center justify-center mb-3'>
              <Ionicons name="sunny" size={32} color="#FFB74D" />
            </View>
            <Text className='text-sm font-medium text-slateText mb-1 text-center'>Nalgas de hierro</Text>
            <Text className='text-xs text-secondaryText text-center'>500km en un día</Text>
          </View>
          <View className='w-32 bg-card p-4 rounded-xl items-center'>
            <View className='w-16 h-16 rounded-full bg-card items-center justify-center mb-3'>
              <Ionicons name="leaf" size={32} color="#717971" />
            </View>
            <Text className='text-sm font-medium text-secondaryText mb-1 text-center'>Explorador</Text>
            <Text className='text-xs text-secondaryText/60 text-center'>Bloqueado</Text>
          </View>
        </ScrollView>

      </View>
    </ScrollView>
  )
}
