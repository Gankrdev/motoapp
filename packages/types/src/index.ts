export interface Author {
    id: string,
    username: string,
    avatarUrl: string | null
}

export interface Post {
    id: string,
    caption: string | null,
    mediaUrls: string[],
    likesCount: number,
    commentsCount: number,
    createdAt: string,
    author: Author
}
