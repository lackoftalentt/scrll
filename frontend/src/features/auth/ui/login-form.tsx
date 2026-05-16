'use client'

import { FormEvent } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import login_illustrate from '@/assets/login_illustrate.jpg'

import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel
} from '@/components/ui/field'

import { Input } from '@/components/ui/input'

import { cn } from '@/lib/utils'

import { useLoginMutation } from '@/features/auth/api/login.mutation'

export function LoginForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const router = useRouter()

	const mutation = useLoginMutation()

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const formData = new FormData(event.currentTarget)

		const username = String(formData.get('username') ?? '').trim()

		const password = String(formData.get('password') ?? '')

		try {
			await mutation.mutateAsync({
				username,
				password
			})

			router.replace('/')
		} catch {
			// handled by react query
		}
	}

	return (
		<div
			className={cn('flex flex-col gap-6', className)}
			{...props}
		>
			<Card className="overflow-hidden border-primary/10 bg-card/85 p-0 shadow-2xl shadow-black/30">
				<CardContent className="grid p-0 md:grid-cols-2">
					<form
						className="p-6 md:p-8"
						onSubmit={handleSubmit}
					>
						<FieldGroup>
							<div className="flex flex-col items-center gap-2 text-center">
								<h1 className="text-2xl font-bold">Welcome back</h1>

								<p className="text-balance text-muted-foreground">
									Login to your SCRLL account
								</p>
							</div>

							<Field>
								<FieldLabel htmlFor="username">Username</FieldLabel>

								<Input
									id="username"
									name="username"
									type="text"
									placeholder="your_username"
									autoComplete="username"
									required
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="password">Password</FieldLabel>

								<Input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
								/>
							</Field>

							<Field>
								{mutation.error && (
									<p
										className="text-xs font-normal text-destructive"
										role="alert"
									>
										{mutation.error instanceof Error
											? mutation.error.message
											: 'Unable to log in'}
									</p>
								)}

								<Button
									type="submit"
									disabled={mutation.isPending}
								>
									{mutation.isPending ? 'Logging in...' : 'Login'}
								</Button>
							</Field>

							<FieldDescription className="text-center">
								Don&apos;t have an account? <Link href="/signup">Sign up</Link>
							</FieldDescription>
						</FieldGroup>
					</form>

					<div className="relative hidden bg-muted md:block">
						<img
							src={login_illustrate.src}
							alt="Login background"
							className="absolute inset-0 h-full w-full object-cover opacity-80 brightness-[0.55] saturate-125"
						/>
						<div className="absolute inset-0 bg-primary/10 mix-blend-screen" />
					</div>
				</CardContent>
			</Card>

			<FieldDescription className="px-6 text-center">
				By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
				and <a href="#">Privacy Policy</a>.
			</FieldDescription>
		</div>
	)
}
