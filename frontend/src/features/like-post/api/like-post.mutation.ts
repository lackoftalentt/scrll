'use client'

import type { InfiniteData } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { togglePostLike } from '@/entities/post/api/post.api'
import type { Post } from '@/entities/post/model/types'

import type { PaginatedResponse } from '@/shared/types/pagination'

import { useAuthStore } from '@/features/auth/model/auth-store'

export function useLikePostMutation() {
	const accessToken = useAuthStore(s => s.accessToken)

	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (postId: number) => {
			if (!accessToken) {
				throw new Error('Unauthorized')
			}

			return togglePostLike(accessToken, postId)
		},

		onMutate: async postId => {
			await queryClient.cancelQueries({
				queryKey: ['posts']
			})

			const previousPosts = queryClient.getQueryData<
				InfiniteData<PaginatedResponse<Post>>
			>(['posts'])

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

							results: page.results.map(post => {
								if (post.id !== postId) {
									return post
								}

								const isLiked = !post.is_liked

								return {
									...post,
									is_liked: isLiked,
									likes_count: isLiked
										? post.likes_count + 1
										: post.likes_count - 1
								}
							})
						}))
					}
				}
			)

			queryClient.setQueryData<Post[]>(['my-posts'], old => {
				if (!old) {
					return old
				}

				return old.map(post => {
					if (post.id !== postId) {
						return post
					}

					const isLiked = !post.is_liked

					return {
						...post,
						is_liked: isLiked,
						likes_count: isLiked ? post.likes_count + 1 : post.likes_count - 1
					}
				})
			})

			return { previousPosts }
		},

		onError: (_error, _postId, context) => {
			if (context?.previousPosts) {
				queryClient.setQueryData(['posts'], context.previousPosts)
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['posts']
			})
		}
	})
}
