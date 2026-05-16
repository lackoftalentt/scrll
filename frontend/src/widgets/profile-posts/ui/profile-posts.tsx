'use client'

import { PostCard } from '@/entities/post/ui/post-card'

import { useCurrentUser } from '@/entities/user/model/use-current-user'

import { useMyPosts } from '@/entities/post/model/use-my-posts'

import { CreatePostDialog } from '@/features/create-post/ui/create-post-dialog'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { Skeleton } from '@/components/ui/skeleton'

export function ProfilePosts() {
	const userQuery = useCurrentUser()

	const postsQuery = useMyPosts()

	const isLoading = userQuery.isLoading || postsQuery.isLoading

	const posts = postsQuery.data ?? []

	return (
		<section>
			<Card className="bg-card/55 p-4 shadow-sm">
				<CardHeader className="flex flex-row items-start justify-between space-y-0 px-0">
					<div>
						<CardTitle>Posts</CardTitle>

						<CardDescription>
							{isLoading
								? 'Loading posts...'
								: `${posts.length} posts by ${userQuery.data?.username}`}
						</CardDescription>
					</div>

					<CreatePostDialog />
				</CardHeader>

				<CardContent className="px-0">
					{isLoading ? (
						<div className="columns-1 gap-5 md:columns-2">
							{Array.from({
								length: 4
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
									</div>
								</div>
							))}
						</div>
					) : posts.length > 0 ? (
						<div className="columns-1 gap-5 md:columns-2">
							{posts.map(post => (
								<div
									key={post.id}
									className="mb-5 break-inside-avoid"
								>
									<PostCard
										post={post}
										canManage
									/>
								</div>
							))}
						</div>
					) : (
						<div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed bg-card/40 text-sm text-muted-foreground">
							This profile has no posts yet.
						</div>
					)}
				</CardContent>
			</Card>
		</section>
	)
}
