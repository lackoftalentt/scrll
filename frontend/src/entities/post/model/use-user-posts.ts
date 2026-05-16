'use client'

import { useQuery } from '@tanstack/react-query'

import { useAuthStore } from '@/features/auth/model/auth-store'

import { API_URL } from '@/shared/api/constants'

import type { PaginatedResponse } from '@/shared/types/pagination'

import type { Post } from './types'

async function getUserPosts(token: string, username: string): Promise<Post[]> {
	const posts: Post[] = []
	let nextUrl: string | null = `${API_URL}/api/posts/`

	while (nextUrl) {
		const response = await fetch(nextUrl, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})

		if (!response.ok) {
			throw new Error('Failed to load user posts')
		}

		const data = (await response.json()) as Post[] | PaginatedResponse<Post>

		if (Array.isArray(data)) {
			posts.push(...data)
			nextUrl = null
		} else {
			posts.push(...data.results)
			nextUrl = data.next
		}
	}

	return posts.filter(post => post.author === username)
}

export function useUserPosts(username: string) {
	const accessToken = useAuthStore(s => s.accessToken)

	return useQuery({
		queryKey: ['user-posts', accessToken, username],
		queryFn: () => getUserPosts(accessToken ?? '', username),
		enabled: Boolean(accessToken && username)
	})
}
