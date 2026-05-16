'use client'

import {
	AtIcon,
	CalendarBlankIcon,
	IdentificationCardIcon
} from '@phosphor-icons/react/dist/ssr'

import { PostCard } from '@/entities/post/ui/post-card'

import { useUserPosts } from '@/entities/post/model/use-user-posts'

import { useUserProfile } from '@/entities/user/model/use-user-profile'

import { ProfileGate } from '@/widgets/profile-gate/ui/profile-gate'

import { AppPageHeader } from '@/widgets/app-header/ui/app-page-header'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { Skeleton } from '@/components/ui/skeleton'

type UserProfilePageProps = {
	username: string
}

const dateFormatter = new Intl.DateTimeFormat('en', {
	day: 'numeric',
	month: 'long',
	year: 'numeric'
})

function getInitials(username: string) {
	return username.slice(0, 2).toUpperCase()
}

export function UserProfilePage({ username }: UserProfilePageProps) {
	const userQuery = useUserProfile(username)

	const postsQuery = useUserPosts(username)

	const posts = postsQuery.data ?? []

	const isProfileLoading = userQuery.isLoading

	const profile = userQuery.data

	const joinedAt = profile?.created_at
		? dateFormatter.format(new Date(profile.created_at))
		: null

	return (
		<div className="flex min-h-screen flex-1 flex-col bg-background/70">
			<AppPageHeader title={username} />

			<main className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
				<ProfileGate>
					<div className="grid gap-4 xl:grid-cols-[320px_1fr]">
						<section className="space-y-4">
							<Card>
								<CardContent className="pt-2">
									<div className="flex flex-col items-center text-center">
										{isProfileLoading ? (
											<Skeleton className="size-24 rounded-full" />
										) : (
											<div className="flex size-24 items-center justify-center rounded-full border border-primary/40 bg-primary text-2xl font-semibold text-primary-foreground shadow-lg shadow-primary/10">
												{getInitials(profile?.username ?? username)}
											</div>
										)}

										<div className="mt-4 w-full space-y-2">
											{isProfileLoading ? (
												<>
													<Skeleton className="mx-auto h-6 w-40" />

													<Skeleton className="mx-auto h-4 w-52" />
												</>
											) : (
												<>
													<h1 className="text-xl font-semibold">
														{profile?.username ?? username}
													</h1>

													<p className="text-sm text-muted-foreground">
														{profile?.email}
													</p>
												</>
											)}
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Bio</CardTitle>

									<CardDescription>Public profile description</CardDescription>
								</CardHeader>

								<CardContent>
									{isProfileLoading ? (
										<div className="space-y-2">
											<Skeleton className="h-4 w-full" />

											<Skeleton className="h-4 w-4/5" />
										</div>
									) : (
										<p className="text-sm leading-6 text-foreground/80">
											{profile?.bio || 'No bio yet.'}
										</p>
									)}
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Account</CardTitle>

									<CardDescription>Profile details</CardDescription>
								</CardHeader>

								<CardContent className="space-y-3 text-sm">
									<div className="flex items-center gap-2">
										<IdentificationCardIcon className="size-4 text-muted-foreground" />

										<span>{isProfileLoading ? 'Loading...' : profile?.username}</span>
									</div>

									<div className="flex items-center gap-2">
										<AtIcon className="size-4 text-muted-foreground" />

										<span>{isProfileLoading ? 'Loading...' : profile?.email}</span>
									</div>

									<div className="flex items-center gap-2">
										<CalendarBlankIcon className="size-4 text-muted-foreground" />

										<span>{isProfileLoading ? 'Loading...' : joinedAt}</span>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Activity</CardTitle>

									<CardDescription>
										{postsQuery.isLoading
											? 'Loading posts...'
											: `${posts.length} posts`}
									</CardDescription>
								</CardHeader>
							</Card>
						</section>

						<section>
							<Card className="bg-card/55 p-4 shadow-sm">
								<CardHeader className="px-0">
									<CardTitle>Posts</CardTitle>

									<CardDescription>Posts by {username}</CardDescription>
								</CardHeader>

								<CardContent className="px-0">
									{postsQuery.isLoading ? (
										<div className="columns-1 gap-5 md:columns-2">
											{Array.from({ length: 4 }).map((_, index) => (
												<div
													key={index}
													className="mb-5 break-inside-avoid rounded-lg border border-border/70 bg-card/60 p-5"
												>
													<Skeleton className="h-4 w-32" />
													<Skeleton className="mt-4 h-4 w-full" />
													<Skeleton className="mt-2 h-4 w-4/5" />
												</div>
											))}
										</div>
									) : postsQuery.isError ? (
										<div className="flex min-h-[200px] items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
											{postsQuery.error.message}
										</div>
									) : posts.length > 0 ? (
										<div className="columns-1 gap-5 md:columns-2">
											{posts.map(post => (
												<div
													key={post.id}
													className="mb-5 break-inside-avoid"
												>
													<PostCard post={post} />
												</div>
											))}
										</div>
									) : (
										<div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed bg-card/40 text-sm text-muted-foreground">
											This user has no posts yet.
										</div>
									)}
								</CardContent>
							</Card>
						</section>
					</div>
				</ProfileGate>
			</main>
		</div>
	)
}
