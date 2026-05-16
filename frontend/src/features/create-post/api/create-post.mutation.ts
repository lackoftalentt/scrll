'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
	createPost,
	type CreatePostPayload
} from '@/entities/post/api/post.api'

import { useAuthStore } from '@/features/auth/model/auth-store'

export function useCreatePostMutation() {
	const accessToken = useAuthStore(s => s.accessToken)

	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (payload: CreatePostPayload) => {
			if (!accessToken) {
				throw new Error('Unauthorized')
			}

			return createPost(accessToken, payload)
		},

		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ['my-posts']
				}),

				queryClient.invalidateQueries({
					queryKey: ['posts']
				})
			])
		}
	})
}
