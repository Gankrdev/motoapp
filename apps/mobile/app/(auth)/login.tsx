import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { router } from 'expo-router'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useAuthStore } from '../../stores/auth-store'

const BG_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAtr4cy-hwPtLJJYBZw2_THcsJ00tAjMMwZ4Nd2WAYsoqQt5asIGDW_NfkhECWkR1KBhpieOD7yUMxTKSuMMTlVLSqp_FfWxC3AydHzZPi53v7TOJyPug3SptZKfGw3ei2rlr39kkaVXKCe_xxM4S6v0irtTRZ8kogMYhqCFjjXCuR9rJdc2wUNCJjw1AgCRJy9l9FFY3kcXBYQ9UhUlLNwtocU3gve4W5HVsgL_DD9ff4r7Rm5B0we9tmvaDobYPsdwPSwwfSCpr1G'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const { sendMagicLink, isLoading } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  const handleSendMagicLink = async () => {
    if (!email) return
    setError(null)
    try {
      await sendMagicLink(email)
      router.push({ pathname: '/(auth)/verify', params: { email } })
    } catch (e) {
      setError((e as Error).message)
    }
  }


  return (
    <ImageBackground source={{ uri: BG_IMAGE }} className="flex-1">
      <View className="absolute inset-0 bg-black/30" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center items-center p-4"
      >
        <View className="w-full max-w-[400px] bg-white/90 rounded-3xl p-8 items-center shadow-2xl border border-white/20">
          {/* Logo */}
          <View className="items-center mb-10">
            <View className="w-16 h-16 bg-primary rounded-2xl justify-center items-center mb-5 shadow-lg rotate-3">
              <MaterialCommunityIcons name="motorbike" size={36} color="#fff" />
            </View>
            <Text className="text-3xl font-extrabold text-earth-brown tracking-tight">
              MotoRoute
            </Text>
            <Text className="text-sm font-medium text-primary/80 mt-1">
              Adventure awaits you
            </Text>
          </View>

          {/* Email */}
          <View className="w-full gap-5">
            <View className="w-full">
              <Text className="text-[11px] font-bold text-earth-brown/70 mb-1.5 ml-1 tracking-widest uppercase">
                EMAIL ADDRESS
              </Text>
              <TextInput
                className="w-full px-4 py-3.5 rounded-2xl border border-primary/20 bg-white/60 text-earth-brown text-base"
                placeholder="your@email.com"
                placeholderTextColor="rgba(93, 64, 55, 0.4)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Pressable
              className="w-full bg-primary active:bg-primary-dark active:scale-[0.97] flex-row justify-center items-center py-4 rounded-2xl mt-4 shadow-lg"
              onPress={handleSendMagicLink}
              disabled={isLoading}
            >
              <MaterialIcons name="auto-awesome" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text className="text-white text-lg font-extrabold">
                {
                  isLoading ? 'Sending...' : 'Send Magic Link'
                }
              </Text>
            </Pressable>
            {
              error && (
                <View className="mt-3">
                  <Text className="text-error font-extrabold">{error}</Text>
                </View>

              )
            }
          </View>

          {/* Divider */}
          <View className="w-full flex-row items-center my-8">
            <View className="flex-1 h-px bg-earth-brown/10" />
            <Text className="px-4 text-[10px] font-bold text-earth-brown/40 tracking-[2px] uppercase">
              OR CONNECT WITH
            </Text>
            <View className="flex-1 h-px bg-earth-brown/10" />
          </View>

          {/* Social Buttons */}
          <View className="flex-row w-full gap-4">
            <Pressable className="flex-1 flex-row items-center justify-center gap-2 py-3.5 rounded-2xl border border-earth-brown/10 bg-white">
              <MaterialCommunityIcons name="google" size={20} color="#5D4037" />
              <Text className="text-sm font-bold text-earth-brown">Google</Text>
            </Pressable>
            <Pressable className="flex-1 flex-row items-center justify-center gap-2 py-3.5 rounded-2xl border border-earth-brown/10 bg-white">
              <MaterialCommunityIcons name="apple" size={20} color="#5D4037" />
              <Text className="text-sm font-bold text-earth-brown">Apple</Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View className="mt-10">
            <Text className="text-sm font-medium text-earth-brown/60">
              New here?{' '}
              <Text className="text-primary font-extrabold">Create Account</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}
