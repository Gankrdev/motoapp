import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api-client'
import { Post } from '@motoapp/types';

export function usePosts() {
    return useQuery({
        queryKey: ['posts'],
        queryFn: () => api<Post[]>('/posts?limit=20&offset=0')
    })
}