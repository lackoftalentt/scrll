'use client'

import { PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr'

import { useState } from 'react'

import type { Post } from '@/entities/post/model/types'

import { useEditPostMutation } from '../api/edit-post.mutation'

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

type EditPostDialogProps = {
	post: Post
}

export function EditPostDialog({ post }: EditPostDialogProps) {
	const [open, setOpen] = useState(false)

	const [content, setContent] = useState(post.content)

	const [image, setImage] = useState<File | null>(null)

	const editPostMutation = useEditPostMutation()

	const trimmedContent = content.trim()

	const hasChanges = trimmedContent !== post.content.trim() || image !== null

	const previewUrl = image ? URL.createObjectURL(image) : post.image

	const handleSave = () => {
		if (!trimmedContent || !hasChanges || editPostMutation.isPending) {
			return
		}

		editPostMutation.mutate(
			{
				postId: post.id,

				payload: {
					content: trimmedContent,
					image
				}
			},
			{
				onSuccess: () => {
					setOpen(false)
					setImage(null)
				}
			}
		)
	}

	return (
		<Dialog
			open={open}
			onOpenChange={nextOpen => {
				setOpen(nextOpen)

				if (nextOpen) {
					setContent(post.content)
				} else {
					editPostMutation.reset()
					setImage(null)
				}
			}}
		>
			<DialogTrigger asChild>
				<Button
					size="icon"
					variant="ghost"
				>
					<PencilSimpleIcon className="size-4" />
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Edit post</DialogTitle>

					<DialogDescription>Update your post.</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<Input
						placeholder="What's happening?"
						value={content}
						onChange={event => setContent(event.target.value)}
						onKeyDown={event => {
							if (event.key === 'Enter') {
								handleSave()
							}
						}}
					/>

					<Input
						type="file"
						accept="image/*"
						onChange={event => {
							const file = event.target.files?.[0]

							setImage(file ?? null)
						}}
						placeholder="sex"
					/>

					{previewUrl ? (
						<img
							src={previewUrl}
							alt=""
							className="max-h-[400] w-full rounded-lg object-cover"
						/>
					) : null}

					{editPostMutation.isError ? (
						<p className="text-sm text-destructive">
							{editPostMutation.error.message}
						</p>
					) : null}
				</div>

				<DialogFooter>
					<Button
						type="button"
						disabled={
							!trimmedContent || !hasChanges || editPostMutation.isPending
						}
						onClick={handleSave}
					>
						{editPostMutation.isPending ? 'Saving...' : 'Save'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
