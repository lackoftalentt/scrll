'use client'

import { AppPageHeader } from '@/widgets/app-header/ui/app-page-header'

import { ProfileGate } from '@/widgets/profile-gate/ui/profile-gate'

import { ProfileOverview } from '@/widgets/profile-overview/ui/profile-overview'

import { ProfilePosts } from '@/widgets/profile-posts/ui/profile-posts'

export function ProfilePage() {
	return (
		<div className="flex min-h-screen flex-1 flex-col bg-background/70">
			<AppPageHeader title="Profile" />

			<main className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
				<ProfileGate>
					<div className="grid gap-4 xl:grid-cols-[320px_1fr]">
						<ProfileOverview />

						<ProfilePosts />
					</div>
				</ProfileGate>
			</main>
		</div>
	)
}
