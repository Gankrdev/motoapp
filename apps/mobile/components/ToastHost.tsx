import { View, Text, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useToastStore, type ToastType } from '../stores/toast-store'

const bgByType: Record<ToastType, string> = {
    error: 'bg-error',
    success: 'bg-success',
    info: 'bg-primary',
}

export function ToastHost() {
    const toasts = useToastStore((s) => s.toasts)
    const dismiss = useToastStore((s) => s.dismiss)
    const insets = useSafeAreaInsets()

    if (toasts.length === 0) return null

    return (
        <View
            pointerEvents="box-none"
            style={{ position: 'absolute', top: insets.top + 8, left: 0, right: 0, zIndex: 9999 }}
            className="px-4 gap-2"
        >
            {toasts.map((t) => (
                <Pressable
                    key={t.id}
                    onPress={() => dismiss(t.id)}
                    className={`${bgByType[t.type]} rounded-2xl px-4 py-3 shadow-lg`}
                >
                    <Text className="text-white font-extrabold">{t.message}</Text>
                </Pressable>
            ))}
        </View>
    )
}
