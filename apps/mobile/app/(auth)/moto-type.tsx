import { useState } from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useAuthStore } from '../../stores/auth-store'

const MOTO_TYPES = [
    { id: 'adventure', label: 'Adventure', subtitle: 'Dual-sport & ADV', icon: 'image-filter-hdr' },
    { id: 'sport', label: 'Sport', subtitle: 'Superbike & Naked', icon: 'speedometer' },
    { id: 'cruiser', label: 'Cruiser', subtitle: 'V-Twin & Custom', icon: 'motorbike' },
    { id: 'touring', label: 'Touring', subtitle: 'Long haul', icon: 'map-marker-path' },
    { id: 'off-road', label: 'Off-road', subtitle: 'Dirt & Enduro', icon: 'pine-tree' },
    { id: 'standard', label: 'Standard', subtitle: 'Commuter & Retro', icon: 'road-variant' },
] as const

export default function MotoTypeScreen() {
    const [selected, setSelected] = useState<string[]>([])
    const { updateMotoTypes } = useAuthStore()

    const toggle = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        )
    }

    const handleContinue = async () => {
        if (selected.length > 0) {
            await updateMotoTypes(selected)
        }
        useAuthStore.setState({ isNewUser: false })
        router.replace('/(tabs)/feed')
    }

    return (
        <View className="flex-1 bg-[#1a1a1a]">
            {/* Top Navigation */}
            <View className="flex-row items-center justify-between px-6 pt-14 pb-2">
                <Pressable
                    className="w-10 h-10 items-center justify-center rounded-full"
                    onPress={() => router.back()}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#FAF3DD" />
                </Pressable>
                <Pressable onPress={() => {
                    useAuthStore.setState({ isNewUser: false })
                    router.replace('/(tabs)/feed')
                }}>
                    <Text className="text-sm font-bold text-[#FAF3DD]/50">Skip</Text>
                </Pressable>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="mb-6 pt-2">
                    <Text className="text-3xl font-extrabold text-[#FAF3DD] tracking-tight mb-3">
                        What do you ride?
                    </Text>
                    <Text className="text-base font-medium text-gray-400 leading-relaxed">
                        Select your motorcycle type so we can find the perfect roads for you.
                    </Text>
                </View>

                {/* Grid */}
                <View className="flex-row flex-wrap justify-between">
                    {MOTO_TYPES.map((type) => {
                        const isSelected = selected.includes(type.id)
                        return (
                            <Pressable
                                key={type.id}
                                onPress={() => toggle(type.id)}
                                style={{ width: '48%' }}
                                className={`mb-4 rounded-xl p-5 ${isSelected
                                    ? 'bg-primary/10 border-2 border-primary'
                                    : 'bg-[#242424] border border-white/10'
                                    }`}
                            >
                                <View className={`w-12 h-12 rounded-full items-center justify-center mb-4 ${isSelected ? 'bg-primary/20' : 'bg-white/5'
                                    }`}>
                                    <MaterialCommunityIcons
                                        name={type.icon}
                                        size={28}
                                        color={isSelected ? '#4A7C59' : '#FAF3DD'}
                                    />
                                </View>

                                <Text className={`text-lg font-bold ${isSelected ? 'text-primary' : 'text-[#FAF3DD]'}`}>
                                    {type.label}
                                </Text>
                                <Text className={`text-xs font-medium mt-1 ${isSelected ? 'text-primary/70' : 'text-gray-500'}`}>
                                    {type.subtitle}
                                </Text>

                                {isSelected && (
                                    <View className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary items-center justify-center">
                                        <MaterialIcons name="check" size={16} color="#fff" />
                                    </View>
                                )}
                            </Pressable>
                        )
                    })}
                </View>
            </ScrollView>

            {/* Fixed Footer */}
            <View className="absolute bottom-0 w-full bg-[#1a1a1a] px-6 pb-8 pt-4 border-t border-white/10">
                <Pressable
                    className="w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary active:bg-primary-dark active:scale-[0.98] py-4"
                    onPress={handleContinue}
                >
                    <Text className="text-white text-lg font-bold">Let's Ride</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="#C7A44D" />
                </Pressable>
            </View>
        </View>
    )
}
