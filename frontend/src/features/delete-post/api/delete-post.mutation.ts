'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deletePost } from '@/entities/post/api/post.api'

import { useAuthStore } from '@/features/auth/model/auth-store'

export function useDeletePostMutation() {
	const accessToken = useAuthStore(s => s.accessToken)

	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (postId: number) => {
			if (!accessToken) {
				throw new Error('Unauthorized')
			}

			return deletePost(accessToken, postId)
		},

		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ['posts']
				}),

				queryClient.invalidateQueries({
					queryKey: ['my-posts']
				})
			])
		}
	})
}
