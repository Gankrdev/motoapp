import { View, Text, Image } from "react-native";
import { Post } from "@motoapp/types";

interface PostCardProps {
    post: Post
}

export function PostCard({ post }: PostCardProps) {
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