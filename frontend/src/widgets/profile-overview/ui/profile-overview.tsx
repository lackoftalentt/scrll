'use client'

import { useRouter } from 'next/navigation'

import {
	AtIcon,
	CalendarBlankIcon,
	IdentificationCardIcon,
	SignOutIcon
} from '@phosphor-icons/react/dist/ssr'

import { useCurrentUser } from '@/entities/user/model/use-current-user'

import { useAuthStore } from '@/features/auth/model/auth-store'

import { UpdateBioDialog } from '@/features/update-bio/ui/update-bio-dialog'

import { Button } from '@/components/ui/button'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { Skeleton } from '@/components/ui/skeleton'

const dateFormatter = new Intl.DateTimeFormat('en', {
	day: 'numeric',
	month: 'long',
	year: 'numeric'
})

function getInitials(username?: string) {
	if (!username) {
		return 'U'
	}

	return username.slice(0, 2).toUpperCase()
}

export function ProfileOverview() {
	const router = useRouter()

	const logout = useAuthStore(s => s.logout)

	const userQuery = useCurrentUser()

	const isLoading = userQuery.isLoading

	const joinedAt = userQuery.data?.created_at
		? dateFormatter.format(new Date(userQuery.data.created_at))
		: null

	function handleLogout() {
		logout()
		router.replace('/login')
	}

	return (
		<section className="space-y-4">
			<Card>
				<CardContent className="pt-2">
					<div className="flex flex-col items-center text-center">
						{isLoading ? (
							<Skeleton className="size-24 rounded-full" />
						) : (
							<div className="flex size-24 items-center justify-center rounded-full border border-primary/40 bg-primary text-2xl font-semibold text-primary-foreground shadow-lg shadow-primary/10">
								{getInitials(userQuery.data?.username)}
							</div>
						)}

						<div className="mt-4 w-full space-y-2">
							{isLoading ? (
								<>
									<Skeleton className="mx-auto h-6 w-40" />

									<Skeleton className="mx-auto h-4 w-52" />
								</>
							) : (
								<>
									<h1 className="text-xl font-semibold">
										{userQuery.data?.username}
									</h1>

									<p className="text-sm text-muted-foreground">
										{userQuery.data?.email}
									</p>
								</>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-start justify-between space-y-0">
					<div>
						<CardTitle>Bio</CardTitle>

						<CardDescription>Public profile description</CardDescription>
					</div>

					<UpdateBioDialog
						initialBio={userQuery.data?.bio}
						disabled={isLoading}
					/>
				</CardHeader>

				<CardContent>
					{isLoading ? (
						<div className="space-y-2">
							<Skeleton className="h-4 w-full" />

							<Skeleton className="h-4 w-4/5" />
						</div>
					) : (
						<p className="text-sm leading-6 text-foreground/80">
							{userQuery.data?.bio || 'No bio yet.'}
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

						<span>{isLoading ? 'Loading...' : userQuery.data?.username}</span>
					</div>

					<div className="flex items-center gap-2">
						<AtIcon className="size-4 text-muted-foreground" />

						<span>{isLoading ? 'Loading...' : userQuery.data?.email}</span>
					</div>

					<div className="flex items-center gap-2">
						<CalendarBlankIcon className="size-4 text-muted-foreground" />

						<span>{isLoading ? 'Loading...' : joinedAt}</span>
					</div>
				</CardContent>
			</Card>

			<Button
				type="button"
				variant="outline"
				className="w-full border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400"
				onClick={handleLogout}
			>
				<SignOutIcon className="size-4" />
				Logout
			</Button>
		</section>
	)
}
