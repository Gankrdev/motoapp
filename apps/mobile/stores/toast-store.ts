import { create } from 'zustand'

export type ToastType = 'error' | 'success' | 'info'

export interface Toast {
    id: string
    type: ToastType
    message: string
}

interface ToastStore {
    toasts: Toast[]
    show: (type: ToastType, message: string) => void
    dismiss: (id: string) => void
}

export const useToastStore = create<ToastStore>((set, get) => ({
    toasts: [],
    show: (type, message) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        set((s) => ({ toasts: [...s.toasts, { id, type, message }] }))
        setTimeout(() => get().dismiss(id), 4000)
    },
    dismiss: (id) => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    },
}))
