import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import { api, ApiError } from '../lib/api-client'

interface User {
  id: string
  email: string
  username: string
  avatarUrl?: string | null
  bio?: string | null
  motoTypes?: string[]
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isNewUser: boolean

  sendMagicLink: (email: string) => Promise<void>
  verify: (token: string) => Promise<void>
  logout: () => Promise<void>
  loadToken: () => Promise<void>
  updateMotoTypes: (motoTypes: string[]) => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isNewUser: false,

  sendMagicLink: async (email) => {
    set({ isLoading: true })
    try {
      await api('/auth/magic-link', { method: 'POST', body: { email }, auth: false })
    } finally {
      set({ isLoading: false })
    }
  },

  verify: async (code) => {
    set({ isLoading: true })
    try {
      const data = await api<{ token: string, user: User, isNewUser: boolean }>('/auth/verify', { method: 'POST', body: { token: code }, auth: false })

      await SecureStore.setItemAsync('auth_token', data.token)
      set({
        token: data.token,
        user: data.user,
        isNewUser: data.isNewUser,
        isAuthenticated: true
      })
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token')
    set({ token: null, user: null, isAuthenticated: false })
  },

  // 

  loadToken: async () => {
    const stored = await SecureStore.getItemAsync('auth_token')
    if (!stored) return

    try {
      const user = await api<User>('/users/me')
      set({ token: stored, user, isAuthenticated: true })
    } catch (e) {
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
        await SecureStore.deleteItemAsync('auth_token')
        return
      }
    }
  },

  updateMotoTypes: async (motoTypes) => {
    await api('/users/me', { method: 'PATCH', body: { motoTypes } })
  }
}))
