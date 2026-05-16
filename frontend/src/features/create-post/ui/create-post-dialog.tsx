'use client'

import { useState } from 'react'

import { useCreatePostMutation } from '../api/create-post.mutation'

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

import { Input } from '@/components/ui/input'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export function CreatePostDialog() {
	const [content, setContent] = useState('')

	const [image, setImage] = useState<File | null>(null)

	const [open, setOpen] = useState(false)

	const createPostMutation = useCreatePostMutation()

	const handlePublish = () => {
		const trimmedContent = content.trim()

		if (!trimmedContent || createPostMutation.isPending) {
			return
		}

		createPostMutation.mutate(
			{
				content: trimmedContent,
				image
			},
			{
				onSuccess: () => {
					setContent('')
					setImage(null)
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
					createPostMutation.reset()
				}
			}}
		>
			<DialogTrigger asChild>
				<Button>Create post</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Create post</DialogTitle>

					<DialogDescription>
						Share something with the community.
					</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<Input
						placeholder="What's happening?"
						value={content}
						onChange={e => setContent(e.target.value)}
						onKeyDown={event => {
							if (event.key === 'Enter') {
								handlePublish()
							}
						}}
					/>

					<Input
						type="file"
						accept="image/*"
						className="mt-4"
						onChange={e => {
							const file = e.target.files?.[0]

							setImage(file ?? null)
						}}
					/>

					{image ? (
						<img
							src={URL.createObjectURL(image)}
							alt=""
							className="mt-4 max-h-80 w-full rounded-md border border-border/70 object-cover"
						/>
					) : null}

					{createPostMutation.isError ? (
						<p className="mt-2 text-sm text-destructive">
							{createPostMutation.error.message}
						</p>
					) : null}
				</div>

				<DialogFooter>
					<Button
						type="button"
						disabled={!content.trim() || createPostMutation.isPending}
						onClick={handlePublish}
					>
						{createPostMutation.isPending ? 'Publishing...' : 'Publish'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
