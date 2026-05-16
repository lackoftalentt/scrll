'use client'

import { useInfiniteQuery } from '@tanstack/react-query'

import { useAuthStore } from '@/features/auth/model/auth-store'

import { API_URL } from '@/shared/api/constants'

import type { PaginatedResponse } from '@/shared/types/pagination'

import type { Post } from './types'

async function getPosts(
	token: string,
	page = 1
): Promise<PaginatedResponse<Post>> {
	const response = await fetch(`${API_URL}/api/posts/?page=${page}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	if (!response.ok) {
		throw new Error('Failed to fetch posts')
	}

	return response.json()
}

export function useInfinitePosts() {
	const accessToken = useAuthStore(s => s.accessToken)

	return useInfiniteQuery({
		queryKey: ['posts'],

		initialPageParam: 1,

		queryFn: ({ pageParam }) => {
			if (!accessToken) {
				throw new Error('Unauthorized')
			}

			return getPosts(accessToken, pageParam)
		},

		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage.next) {
				return undefined
			}

			return allPages.length + 1
		},

		enabled: Boolean(accessToken)
	})
}
