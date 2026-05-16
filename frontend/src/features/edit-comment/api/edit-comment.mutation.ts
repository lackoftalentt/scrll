'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
	editComment,
	type EditCommentPayload
} from '@/entities/comment/api/comment.api'

import type { Comment } from '@/entities/comment/model/types'

import type { PaginatedResponse } from '@/shared/types/pagination'

import { useAuthStore } from '@/features/auth/model/auth-store'

type UpdateCommentVariables = {
	commentId: number
	postId: number
	payload: EditCommentPayload
}

export function useEditCommentMutation() {
	const accessToken = useAuthStore(s => s.accessToken)

	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ commentId, payload }: UpdateCommentVariables) => {
			if (!accessToken) {
				throw new Error('Unauthorized')
			}

			return editComment(accessToken, commentId, payload)
		},

		onSuccess: async (updatedComment, { postId }) => {
			queryClient.setQueryData<PaginatedResponse<Comment>>(
				['comments', postId],
				old => {
					if (!old) {
						return old
					}

					return {
						...old,

						results: old.results.map(comment =>
							comment.id === updatedComment.id ? updatedComment : comment
						)
					}
				}
			)
		}
	})
}
