import { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, TextInput, Alert } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { useRouter } from "expo-router";
import { usePendingRouteStore } from "../../stores/pending-route-store";
import { useToastStore } from "../../stores/toast-store";
import { usePostRoute } from "../../hooks/use-post-route";
import {
    calculateDistanceKm,
    calculateAvgSpeedKmh,
    formatDuration
} from '../../lib/track-stats';
import { KeyboardStickyView } from "react-native-keyboard-controller";

export default function RoutePreviewScreen() {
    const router = useRouter()
    const coords = usePendingRouteStore((state) => state.coords)
    const durationSec = usePendingRouteStore((state) => state.durationSec)
    const suggestedTitle = usePendingRouteStore((state) => state.suggestedTitle)
    const [title, setTitle] = useState(suggestedTitle ?? '')
    const postRoute = usePostRoute()
    const clear = usePendingRouteStore((state) => state.clear)

    const distanceKm = useMemo(() => calculateDistanceKm(coords), [coords])
    const avgSpeedKmh = useMemo(
        () => calculateAvgSpeedKmh(distanceKm, durationSec ?? 0),
        [distanceKm, durationSec]
    )
    const bounds = useMemo(() => {
        if (coords.length === 0) return null
        const lngs = coords.map(([lng]) => lng)
        const lats = coords.map(([, lat]) => lat)
        return {
            ne: [Math.max(...lngs), Math.max(...lats)] as [number, number],
            sw: [Math.min(...lngs), Math.min(...lats)] as [number, number],
        }
    }, [coords])
    const durationFormatted = formatDuration(durationSec ?? 0)

    useEffect(() => {
        if (coords.length === 0) {
            router.replace('/(tabs)/record')
        }
    }, [coords.length, router])

    useEffect(() => {
        return () => {
            clear()
        }
    }, [clear])

    if (coords.length === 0) {
        return null
    }

    const handleSave = () => {
        postRoute.mutate(
            {
                title: title.trim() || (suggestedTitle ?? 'Ruta sin título'),
                track: { type: 'LineString', coordinates: coords },
                durationSec: durationSec ?? undefined,
                distanceKm: distanceKm ?? undefined,
            },
            {
                onSuccess: () => {
                    useToastStore.getState().show('success', 'Ruta guardada')
                    router.replace('/(tabs)/feed')
                },
            }
        )
    }

    const handleDiscard = () => {
        Alert.alert(
            'Descartar ruta',
            '¿Seguro? Se perderán los datos grabados.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Descartar',
                    style: 'destructive',
                    onPress: () => {
                        router.back()
                    },
                },
            ]
        )
    }


    return (
        <View className="flex-1">
            <Mapbox.MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
                <Mapbox.Camera
                    bounds={
                        bounds ? {
                            ne: bounds.ne,
                            sw: bounds.sw,
                            paddingTop: 60,
                            paddingBottom: 280,
                            paddingLeft: 40,
                            paddingRight: 40
                        } : undefined
                    }
                />
                {coords.length >= 2 && (
                    <Mapbox.ShapeSource
                        id="preview-route-source"
                        shape={{
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: coords,
                            },
                            properties: {},
                        }}
                    >
                        <Mapbox.LineLayer
                            id="preview-route-line"
                            style={{
                                lineColor: '#D63A2A',
                                lineWidth: 4,
                                lineCap: 'round',
                                lineJoin: 'round',
                            }}
                        />
                    </Mapbox.ShapeSource>
                )}

            </Mapbox.MapView>
            {/* panel inferior con stats + input + botones */}
            <KeyboardStickyView className="absolute bottom-2 left-0 right-0 bg-card p-4 rounded-t-3xl">
                {/* fila de stats */}
                <View className="flex-row justify-around mb-4">
                    <View className="items-center">
                        <Text className="text-primaryLight text-2xl font-display">{distanceKm.toFixed(2)}</Text>
                        <Text className="text-slateText text-xs font-body-medium">km</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-primaryLight text-2xl font-display">{durationFormatted}</Text>
                        <Text className="text-slateText text-xs font-body-medium">duración</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-primaryLight text-2xl font-display">{avgSpeedKmh.toFixed(1)}</Text>
                        <Text className="text-slateText text-xs font-body-medium">km/h promedio</Text>
                    </View>
                </View>

                {/* input título */}
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Título de la ruta"
                    placeholderTextColor="#888"
                    className="bg-background text-primaryLight px-4 py-3 rounded-lg mb-4 font-body"
                />

                {/* botones */}
                <View className="flex-row gap-3">
                    <Pressable
                        onPress={handleDiscard}
                        className="flex-1 py-4 rounded-full"
                        style={{ backgroundColor: '#D63A2A' }}
                    >
                        <Text className="text-slateText text-center font-body-semibold">Descartar</Text>
                    </Pressable>
                    <Pressable
                        onPress={handleSave}
                        disabled={postRoute.isPending}
                        className="flex-1 py-4 rounded-full"
                        style={{ backgroundColor: postRoute.isPending ? '#888' : '#4A7C59' }}
                    >
                        <Text className="text-slateText text-center font-body-semibold">
                            {postRoute.isPending ? 'Guardando…' : 'Guardar'}
                        </Text>
                    </Pressable>
                </View>
            </KeyboardStickyView>

        </View>
    )
}
