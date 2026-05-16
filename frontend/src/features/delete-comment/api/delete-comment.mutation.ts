'use client'

import {
	type InfiniteData,
	useMutation,
	useQueryClient
} from '@tanstack/react-query'

import type { Comment } from '@/entities/comment/model/types'

import type { Post } from '@/entities/post/model/types'

import { deleteComment } from '@/entities/comment/api/comment.api'

import type { PaginatedResponse } from '@/shared/types/pagination'

import { useAuthStore } from '@/features/auth/model/auth-store'

type DeleteCommentVariables = {
	commentId: number
	postId: number
}

export function useDeleteCommentMutation() {
	const accessToken = useAuthStore(s => s.accessToken)

	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ commentId }: DeleteCommentVariables) => {
			if (!accessToken) {
				throw new Error('Unauthorized')
			}

			return deleteComment(accessToken, commentId)
		},

		onSuccess: async (_, { commentId, postId }) => {
			queryClient.setQueryData<PaginatedResponse<Comment>>(
				['comments', postId],
				old => {
					if (!old) {
						return old
					}

					return {
						...old,

						results: old.results.filter(comment => comment.id !== commentId)
					}
				}
			)

			queryClient.setQueryData<InfiniteData<PaginatedResponse<Post>>>(
				['posts'],
				old => {
					if (!old) {
						return old
					}

					return {
						...old,

						pages: old.pages.map(page => ({
							...page,

							results: page.results.map(post =>
								post.id === postId
									? {
											...post,

											comments_count: Math.max(0, post.comments_count - 1)
										}
									: post
							)
						}))
					}
				}
			)

			queryClient.setQueryData<Post[]>(['my-posts'], old => {
				if (!old) {
					return old
				}

				return old.map(post =>
					post.id === postId
						? {
								...post,
								comments_count: Math.max(0, post.comments_count - 1)
							}
						: post
				)
			})

			queryClient.setQueriesData<Post[]>(
				{
					queryKey: ['user-posts']
				},
				old => {
					if (!old) {
						return old
					}

					return old.map(post =>
						post.id === postId
							? {
									...post,
									comments_count: Math.max(0, post.comments_count - 1)
								}
							: post
					)
				}
			)

			await queryClient.invalidateQueries({
				queryKey: ['my-posts'],
				refetchType: 'inactive'
			})
		}
	})
}
