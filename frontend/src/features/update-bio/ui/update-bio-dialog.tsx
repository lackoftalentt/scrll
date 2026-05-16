'use client'

import { PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr'

import { useEffect, useState } from 'react'

import { useUpdateBioMutation } from '../api/update-bio.mutation'

import { Button } from '@/components/ui/button'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'

import { Textarea } from '@/components/ui/textarea'

interface UpdateBioDialogProps {
	initialBio?: string
	disabled?: boolean
}

export function UpdateBioDialog({
	initialBio,
	disabled
}: UpdateBioDialogProps) {
	const updateBioMutation = useUpdateBioMutation()

	const [bio, setBio] = useState('')

	const [open, setOpen] = useState(false)

	useEffect(() => {
		setBio(initialBio ?? '')
	}, [initialBio])

	const handleSaveBio = () => {
		const trimmedBio = bio.trim()

		if (updateBioMutation.isPending) {
			return
		}

		updateBioMutation.mutate(
			{ bio: trimmedBio },
			{
				onSuccess: () => {
					setOpen(false)
				}
			}
		)
	}

	return (
		<Dialog
			open={open}
			onOpenChange={nextOpen => {
				setOpen(nextOpen)

				if (!nextOpen) {
					updateBioMutation.reset()
				}
			}}
		>
			<DialogTrigger asChild>
				<Button
					size="icon"
					variant="ghost"
					disabled={disabled}
				>
					<PencilSimpleIcon className="size-4" />
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit bio</DialogTitle>

					<DialogDescription>
						Update your public profile description.
					</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<Textarea
						placeholder="Tell something about yourself..."
						value={bio}
						onChange={e => setBio(e.target.value)}
						className="min-h-[140px]"
					/>

					{updateBioMutation.isError ? (
						<p className="mt-2 text-sm text-destructive">
							{updateBioMutation.error.message}
						</p>
					) : null}
				</div>

				<DialogFooter>
					<Button
						type="button"
						disabled={updateBioMutation.isPending}
						onClick={handleSaveBio}
					>
						{updateBioMutation.isPending ? 'Saving...' : 'Save changes'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
