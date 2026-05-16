'use client'

import {
	InfiniteData,
	useMutation,
	useQueryClient
} from '@tanstack/react-query'

import {
	createComment,
	type CreateCommentPayload
} from '@/entities/comment/api/comment.api'

import type { Comment } from '@/entities/comment/model/types'

import type { PaginatedResponse } from '@/shared/types/pagination'

import type { Post } from '@/entities/post/model/types'
import { useAuthStore } from '@/features/auth/model/auth-store'

type CreateCommentVariables = {
	postId: number
	payload: CreateCommentPayload
}

export function useCreateCommentMutation() {
	const accessToken = useAuthStore(s => s.accessToken)

	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ postId, payload }: CreateCommentVariables) => {
			if (!accessToken) {
				throw new Error('Unauthorized')
			}

			return createComment(accessToken, postId, payload)
		},

		onSuccess: async comment => {
			queryClient.setQueryData<PaginatedResponse<Comment>>(
				['comments', comment.post],
				old => {
					if (!old) {
						return old
					}

					return {
						...old,

						results: [...old.results, comment]
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
								post.id === comment.post
									? {
											...post,
											comments_count: post.comments_count + 1
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
					post.id === comment.post
						? {
								...post,
								comments_count: post.comments_count + 1
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
						post.id === comment.post
							? {
									...post,
									comments_count: post.comments_count + 1
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
