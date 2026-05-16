'use client'

import { FormEvent, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel
} from '@/components/ui/field'

import { Input } from '@/components/ui/input'

import { cn } from '@/lib/utils'

import { useRegisterMutation } from '@/features/auth/api/register.mutation'

import signup_illustration from '@/assets/sign_up_illustration.png'

export function SignupForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const router = useRouter()

	const mutation = useRegisterMutation()

	const [passwordError, setPasswordError] = useState('')

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		setPasswordError('')

		const formData = new FormData(event.currentTarget)

		const username = String(formData.get('username') ?? '').trim()

		const email = String(formData.get('email') ?? '').trim()

		const password = String(formData.get('password') ?? '')

		const confirmPassword = String(formData.get('confirmPassword') ?? '')

		if (password !== confirmPassword) {
			setPasswordError('Passwords do not match.')

			return
		}

		try {
			await mutation.mutateAsync({
				username,
				email,
				password
			})

			router.replace('/login')
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
								<h1 className="text-2xl font-bold">Create your account</h1>

								<p className="text-sm text-balance text-muted-foreground">
									Enter your details below to create your account
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
								<FieldLabel htmlFor="email">Email</FieldLabel>

								<Input
									id="email"
									name="email"
									type="email"
									placeholder="m@example.com"
									autoComplete="email"
									required
								/>

								<FieldDescription>
									We&apos;ll use this to contact you. We will not share your
									email with anyone else.
								</FieldDescription>
							</Field>

							<Field className="grid grid-cols-2 gap-4">
								<Field>
									<FieldLabel htmlFor="password">Password</FieldLabel>

									<Input
										id="password"
										name="password"
										type="password"
										autoComplete="new-password"
										minLength={6}
										required
									/>
								</Field>

								<Field>
									<FieldLabel htmlFor="confirm-password">
										Confirm Password
									</FieldLabel>

									<Input
										id="confirm-password"
										name="confirmPassword"
										type="password"
										autoComplete="new-password"
										minLength={6}
										required
									/>
								</Field>
							</Field>

							<FieldDescription>
								Must be at least 6 characters long.
							</FieldDescription>

							<Field>
								{passwordError && (
									<p
										className="text-xs font-normal text-destructive"
										role="alert"
									>
										{passwordError}
									</p>
								)}

								{mutation.error && (
									<p
										className="text-xs font-normal text-destructive"
										role="alert"
									>
										{mutation.error instanceof Error
											? mutation.error.message
											: 'Unable to create account'}
									</p>
								)}

								<Button
									type="submit"
									disabled={mutation.isPending}
								>
									{mutation.isPending
										? 'Creating account...'
										: 'Create Account'}
								</Button>
							</Field>

							<FieldDescription className="text-center">
								Already have an account? <Link href="/login">Sign in</Link>
							</FieldDescription>
						</FieldGroup>
					</form>

					<div className="relative hidden bg-muted md:block">
						<img
							src={signup_illustration.src}
							alt="Signup background"
							className="absolute inset-0 h-full w-full object-cover opacity-75 brightness-[0.5] saturate-125"
						/>
						<div className="absolute inset-0 bg-primary/10 mix-blend-screen" />
					</div>
				</CardContent>
			</Card>

			<FieldDescription className="px-6 text-center">
				By clicking continue, you agree to our{' '}
				<Link href="/login">Terms of Service</Link> and{' '}
				<a href="#">Privacy Policy</a>.
			</FieldDescription>
		</div>
	)
}
