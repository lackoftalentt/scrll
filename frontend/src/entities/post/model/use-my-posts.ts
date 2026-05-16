'use client'

import { useQuery } from '@tanstack/react-query'

import { useAuthStore } from '@/features/auth/model/auth-store'

import { API_URL } from '@/shared/api/constants'

import type { Post } from './types'

async function getMyPosts(token: string): Promise<Post[]> {
	const response = await fetch(`${API_URL}/api/posts/me/`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	if (!response.ok) {
		throw new Error('Failed to fetch posts')
	}

	return response.json()
}

export function useMyPosts() {
	const accessToken = useAuthStore(s => s.accessToken)

	return useQuery({
		queryKey: ['my-posts'],

		queryFn: () => {
			if (!accessToken) {
				throw new Error('Unauthorized')
			}

			return getMyPosts(accessToken)
		},

		enabled: Boolean(accessToken)
	})
}
