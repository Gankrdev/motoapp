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
import { router, useLocalSearchParams } from 'expo-router'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useAuthStore } from '../../stores/auth-store'

const BG_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAtr4cy-hwPtLJJYBZw2_THcsJ00tAjMMwZ4Nd2WAYsoqQt5asIGDW_NfkhECWkR1KBhpieOD7yUMxTKSuMMTlVLSqp_FfWxC3AydHzZPi53v7TOJyPug3SptZKfGw3ei2rlr39kkaVXKCe_xxM4S6v0irtTRZ8kogMYhqCFjjXCuR9rJdc2wUNCJjw1AgCRJy9l9FFY3kcXBYQ9UhUlLNwtocU3gve4W5HVsgL_DD9ff4r7Rm5B0we9tmvaDobYPsdwPSwwfSCpr1G'

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>()
  const [token, setToken] = useState('')
  const { verify, sendMagicLink, isLoading } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const [resendSuccess, setResendSuccess] = useState<boolean>(false)

  const handleVerify = async () => {
    if (!token) return
    setError(null)
    setResendSuccess(false)
    try {
      await verify(token)
      const { isNewUser } = useAuthStore.getState()
      if (isNewUser) {
        router.replace('/(auth)/welcome')
      } else {
        router.replace('/(tabs)/feed')
      }
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const handleResend = async () => {
    if (!email) return
    setError(null)
    setResendSuccess(false)
    try {
      await sendMagicLink(email)
      setResendSuccess(true)
      setTimeout(() => {
        setResendSuccess(false)
      }, 3000);
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
          {/* Back button */}
          <Pressable
            className="self-start w-12 h-12 justify-center items-center mb-2 -ml-2"
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#5D4037" />
          </Pressable>

          {/* Icon & Title */}
          <View className="items-center mb-9">
            <View className="w-[72px] h-[72px] rounded-full bg-primary/10 justify-center items-center mb-5">
              <MaterialCommunityIcons name="email-outline" size={36} color="#4A7C59" />
            </View>
            <Text className="text-[26px] font-extrabold text-earth-brown tracking-tight mb-2">
              Check your email
            </Text>
            <Text className="text-sm font-medium text-earth-brown/60">
              We sent a magic link to
            </Text>
            <Text className="text-[15px] font-bold text-primary mt-1">
              {email}
            </Text>
          </View>

          {/* Token Input */}
          <View className="w-full gap-5">
            <View className="w-full">
              <Text className="text-[11px] font-bold text-earth-brown/70 mb-1.5 ml-1 tracking-widest uppercase">
                VERIFICATION CODE
              </Text>
              <TextInput
                className="w-full px-4 py-3.5 rounded-2xl border border-primary/20 bg-white/60 text-earth-brown text-base"
                placeholder="Paste your token here"
                placeholderTextColor="rgba(93, 64, 55, 0.4)"
                autoCapitalize="none"
                autoCorrect={false}
                value={token}
                onChangeText={setToken}
              />
            </View>

            <Pressable
              className="w-full bg-primary active:bg-primary-dark active:scale-[0.97] flex-row justify-center items-center py-4 rounded-2xl mt-4 shadow-lg"
              onPress={handleVerify}
              disabled={isLoading}
            >
              <MaterialIcons name="verified" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text className="text-white text-lg font-extrabold">
                {
                  isLoading ? 'Verifying...' : 'Verify Email'
                }
              </Text>
            </Pressable>
            {
              resendSuccess && (
                <View className="mt-3">
                  <Text className="text-success font-extrabold">Email forward successfully!</Text>
                </View>

              )
            }
            {
              error && (
                <View className="mt-3">
                  <Text className="text-error font-extrabold">{error}</Text>
                </View>

              )
            }
          </View>

          {/* Resend */}
          <View className="mt-8">
            <Text className="text-sm font-medium text-earth-brown/60">
              Didn't receive it?{' '}
              <Text className="text-primary font-extrabold" onPress={handleResend}>
                Resend
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}
