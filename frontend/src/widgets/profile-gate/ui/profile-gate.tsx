'use client'

import { ReactNode } from 'react'

import { useAuthStore } from '@/features/auth/model/auth-store'

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { Skeleton } from '@/components/ui/skeleton'

interface ProfileGateProps {
	children: ReactNode
}

export function ProfileGate({ children }: ProfileGateProps) {
	const accessToken = useAuthStore(s => s.accessToken)

	const isInitialized = useAuthStore(s => s.isInitialized)

	if (!isInitialized) {
		return (
			<div className="grid gap-4 xl:grid-cols-[320px_1fr]">
				<section className="space-y-4">
					<Card>
						<div className="pt-6">
							<Skeleton className="mx-auto size-24 rounded-full" />

							<Skeleton className="mx-auto mt-4 h-6 w-40" />

							<Skeleton className="mx-auto mt-2 h-4 w-52" />
						</div>
					</Card>
				</section>

				<section>
					<Card>
						<CardHeader>
							<Skeleton className="h-5 w-24" />

							<Skeleton className="h-4 w-40" />
						</CardHeader>

						<div className="space-y-3 p-6 pt-0">
							<Skeleton className="h-28 w-full" />

							<Skeleton className="h-28 w-full" />
						</div>
					</Card>
				</section>
			</div>
		)
	}

	if (!accessToken) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Profile unavailable</CardTitle>

					<CardDescription>Sign in to view your bio and posts.</CardDescription>
				</CardHeader>
			</Card>
		)
	}

	return children
}
