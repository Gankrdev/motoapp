import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'

const API_URL = 'http://192.168.100.2:3000' // Android emulator localhost

interface User {
  id: string
  email: string
  username: string
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
      const res = await fetch(`${API_URL}/auth/magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Error enviando magic link')
    } finally {
      set({ isLoading: false })
    }
  },

  verify: async (code) => {
    set({ isLoading: true })
    try {
      const res = await fetch(`${API_URL}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: code }),
      })
      if (!res.ok) throw new Error('Token inválido o expirado')

      const data = await res.json()
      await SecureStore.setItemAsync('auth_token', data.token)

      set({
        token: data.token,
        user: data.user,
        isNewUser: data.isNewUser,
        isAuthenticated: true,
      })
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token')
    set({ token: null, user: null, isAuthenticated: false })
  },

  loadToken: async () => {
    const stored = await SecureStore.getItemAsync('auth_token')
    if (!stored) return

    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${stored}`,
        },
      })
      if (!res.ok) {
        //Token inválido, eliminarlo
        await SecureStore.deleteItemAsync('auth_token')
        return
      }
      const user = await res.json()
      set({ token: stored, user, isAuthenticated: true })
    } catch (error) {
      //Error de red: dejamos el token pero sin user
      set({ token: stored, isAuthenticated: false })
    }
  },

  updateMotoTypes: async (motoTypes) => {
    const { token } = useAuthStore.getState()
    const res = await fetch(`${API_URL}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ motoTypes }),
    })
    if (!res.ok) throw new Error('Error actualizando tipos de moto')
  },
}))
