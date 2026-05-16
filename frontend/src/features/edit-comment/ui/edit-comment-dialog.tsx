'use client'

import { PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr'

import { useState } from 'react'

import type { Comment } from '@/entities/comment/model/types'

import { useEditCommentMutation } from '../api/edit-comment.mutation'

import { Button } from '@/components/ui/button'

import { useEffect } from 'react'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'

import { Textarea } from '@/components/ui/textarea'

interface EditCommentDialogProps {
	comment: Comment
	postId: number
}

export function EditCommentDialog({ comment, postId }: EditCommentDialogProps) {
	const [open, setOpen] = useState(false)

	const [content, setContent] = useState(comment.content)

	const editCommentMutation = useEditCommentMutation()

	useEffect(() => {
		setContent(comment.content)
	}, [comment.content])

	return (
		<Dialog
			open={open}
			onOpenChange={nextOpen => {
				setOpen(nextOpen)

				if (!nextOpen) {
					editCommentMutation.reset()
				}
			}}
		>
			<DialogTrigger asChild>
				<Button
					size="icon"
					variant="ghost"
					className="size-7"
				>
					<PencilSimpleIcon className="size-3.5" />
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit comment</DialogTitle>

					<DialogDescription>Update your comment.</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<Textarea
						value={content}
						onChange={e => setContent(e.target.value)}
						className="min-h-[120px]"
					/>

					{editCommentMutation.isError ? (
						<p className="mt-2 text-sm text-destructive">
							{editCommentMutation.error.message}
						</p>
					) : null}
				</div>

				<Button
					type="button"
					disabled={editCommentMutation.isPending}
					onClick={() => {
						const trimmed = content.trim()

						if (!trimmed) {
							return
						}

						editCommentMutation.mutate(
							{
								commentId: comment.id,

								postId,

								payload: {
									content: trimmed
								}
							},
							{
								onSuccess: () => {
									setOpen(false)
								}
							}
						)
					}}
				>
					{editCommentMutation.isPending ? 'Saving...' : 'Save changes'}
				</Button>
			</DialogContent>
		</Dialog>
	)
}
