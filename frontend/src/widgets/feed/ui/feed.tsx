'use client'

import { useEffect } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'

import { useInView } from 'react-intersection-observer'

import { PostCard } from '@/entities/post/ui/post-card'

import { useAuthStore } from '@/features/auth/model/auth-store'

import { API_URL } from '@/shared/api/constants'

import type { PaginatedResponse } from '@/shared/types/pagination'

import { Skeleton } from '@/components/ui/skeleton'

import type { Post } from '@/entities/post/model/types'

async function getFeed(
	token: string,
	page = 1
): Promise<PaginatedResponse<Post>> {
	const response = await fetch(`${API_URL}/api/posts/?page=${page}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	if (!response.ok) {
		throw new Error('Failed to fetch feed')
	}

	return response.json()
}

export function Feed() {
	const accessToken = useAuthStore(s => s.accessToken)

	const { ref, inView } = useInView()

	const feedQuery = useInfiniteQuery({
		queryKey: ['posts'],

		initialPageParam: 1,

		queryFn: ({ pageParam }) => {
			if (!accessToken) {
				throw new Error('Unauthorized')
			}

			return getFeed(accessToken, pageParam)
		},

		getNextPageParam: lastPage => {
			if (!lastPage.next) {
				return undefined
			}

			const url = new URL(lastPage.next)

			return Number(url.searchParams.get('page'))
		},

		enabled: Boolean(accessToken)
	})

	useEffect(() => {
		if (inView && feedQuery.hasNextPage && !feedQuery.isFetchingNextPage) {
			feedQuery.fetchNextPage()
		}
	}, [inView, feedQuery.hasNextPage, feedQuery.isFetchingNextPage])

	if (feedQuery.isLoading) {
		return (
			<div className="columns-1 gap-5 md:columns-2 xl:columns-2 2xl:columns-2">
				{Array.from({
					length: 6
				}).map((_, index) => (
					<div
						key={index}
						className="mb-5 break-inside-avoid rounded-lg border border-border/70 bg-card/60 p-5"
					>
						<div className="flex items-center gap-3">
							<Skeleton className="size-10 rounded-full" />

							<div className="space-y-2">
								<Skeleton className="h-4 w-32" />

								<Skeleton className="h-3 w-20" />
							</div>
						</div>

						<div className="mt-4 space-y-2">
							<Skeleton className="h-4 w-full" />

							<Skeleton className="h-4 w-4/5" />

							<Skeleton className="h-4 w-3/5" />
						</div>

						<div className="mt-5 flex gap-4">
							<Skeleton className="h-8 w-16" />

							<Skeleton className="h-8 w-16" />
						</div>
					</div>
				))}
			</div>
		)
	}

	if (feedQuery.isError) {
		return (
			<div className="flex min-h-[200] items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
				{feedQuery.error.message}
			</div>
		)
	}

	const posts = feedQuery.data?.pages.flatMap(page => page.results) ?? []

	if (posts.length === 0) {
		return (
			<div className="flex min-h-[200] items-center justify-center rounded-lg border border-dashed bg-card/40 text-sm text-muted-foreground">
				No posts yet.
			</div>
		)
	}

	return (
		<>
			<div className="columns-1 gap-5 md:columns-2 xl:columns-2 2xl:columns-2">
				{posts.map(post => (
					<div
						key={post.id}
						className="mb-5 break-inside-avoid"
					>
						<PostCard
							post={post}
							canManage={post.is_owner}
						/>
					</div>
				))}
			</div>

			<div
				ref={ref}
				className="flex h-24 items-center justify-center"
			>
				{feedQuery.isFetchingNextPage ? (
					<p className="text-sm text-muted-foreground">Loading more posts...</p>
				) : feedQuery.hasNextPage ? (
					<p className="text-sm text-muted-foreground">Scroll to load more</p>
				) : (
					<p className="text-sm text-muted-foreground">No more posts</p>
				)}
			</div>
		</>
	)
}
