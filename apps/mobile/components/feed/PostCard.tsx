import { View, Text, Image, ImageBackground, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "@motoapp/types";
import { formatDistanceKm, formatDurationShort } from "../../lib/track-stats";

interface PostCardProps {
    post: Post
}

export function PostCard({ post }: PostCardProps) {
    if (post.route) {
        return (
            <View className="mx-6 mt-8">
                <View className="bg-card rounded-2xl overflow-hidden border border-white/5">
                    {/* Imagen de fondo */}
                    <ImageBackground
                        source={{ uri: post.mediaUrls[0] ?? 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800' }}
                        className="h-32 w-full"
                    >
                        <View className="flex-1 bg-background/40">
                            <View className="absolute bottom-3 left-3 bg-card/90 px-3 py-1 rounded-lg border border-white/10">
                                <Text className="text-[10px] font-black text-slateText uppercase tracking-tight">
                                    {post.route.title}
                                </Text>
                            </View>
                        </View>
                    </ImageBackground>

                    {/* Información de la ruta */}
                    <View className="p-5 flex-row items-center justify-between">
                        <View className="flex-1">
                            <View className="flex-row items-center gap-2">
                                <Text className="text-sm font-extrabold text-slateText">
                                    {post.author.username}
                                </Text>
                                <Text className="text-[10px] font-bold text-secondaryText">
                                    • {formatDurationShort(post.route.durationSec)}
                                </Text>
                            </View>
                            <View className="flex-row items-center gap-3 mt-1.5">
                                <View className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded">
                                    <Text className="text-[10px] font-extrabold text-primaryLight uppercase tracking-wider">
                                        {formatDistanceKm(post.route.distanceKm)}
                                    </Text>
                                </View>
                                <Text className="text-[10px] font-bold text-secondaryText uppercase tracking-widest">
                                    {post.createdAt}
                                </Text>
                            </View>
                        </View>

                        <Pressable className="w-10 h-10 rounded-full bg-background items-center justify-center">
                            <Ionicons name="chevron-forward" size={20} color="#C4C1B1" />
                        </Pressable>
                    </View>
                </View>
            </View>
        )
    }

    return (

        <View className="px-6 py-4">
            <View className="flex-row items-center mb-3">
                {post.author.avatarUrl && (
                    <Image
                        source={{ uri: post.author.avatarUrl }}
                        className="w-10 h-10 rounded-full mr-3"
                    />
                )}
                <Text className="text-white font-bold">{post.author.username}</Text>
            </View>
            {post.caption && (
                <Text className="text-white/90 mb-3">{post.caption}</Text>
            )}
            <View className="flex-row gap-4">
                <Text className="text-white/60 text-sm">{post.likesCount}</Text>
                <Text className="text-white/60 text-sm">{post.commentsCount}</Text>
            </View>

        </View>

    )
}