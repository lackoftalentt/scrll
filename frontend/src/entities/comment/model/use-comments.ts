'use client'

import { useQuery } from '@tanstack/react-query'

import { getComments } from '../api/comment.api'

import type { Comment } from './types'

import { useAuthStore } from '@/features/auth/model/auth-store'

import type { PaginatedResponse } from '@/shared/types/pagination'

export function useComments(postId: number, enabled = true) {
	const accessToken = useAuthStore(s => s.accessToken)

	return useQuery<PaginatedResponse<Comment>>({
		queryKey: ['comments', postId],

		queryFn: () => {
			if (!accessToken) {
				throw new Error('Unauthorized')
			}

			return getComments(accessToken, postId)
		},

		enabled: Boolean(accessToken) && enabled
	})
}
