'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
	updatePost,
	type UpdatePostPayload
} from '@/entities/post/api/post.api'

import { useAuthStore } from '@/features/auth/model/auth-store'

type UpdatePostVariables = {
	postId: number
	payload: UpdatePostPayload
}

export function useEditPostMutation() {
	const accessToken = useAuthStore(s => s.accessToken)

	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ postId, payload }: UpdatePostVariables) => {
			if (!accessToken) {
				throw new Error('Unauthorized')
			}

			return updatePost(accessToken, postId, payload)
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
