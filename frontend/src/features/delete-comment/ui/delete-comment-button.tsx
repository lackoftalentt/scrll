'use client'

import { TrashIcon } from '@phosphor-icons/react/dist/ssr'

import { useState } from 'react'

import { useDeleteCommentMutation } from '../api/delete-comment.mutation'

import { Button } from '@/components/ui/button'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog'

interface DeleteCommentButtonProps {
	commentId: number
	postId: number
}

export function DeleteCommentButton({
	commentId,
	postId
}: DeleteCommentButtonProps) {
	const [open, setOpen] = useState(false)

	const deleteCommentMutation = useDeleteCommentMutation()

	return (
		<AlertDialog
			open={open}
			onOpenChange={nextOpen => {
				setOpen(nextOpen)

				if (!nextOpen) {
					deleteCommentMutation.reset()
				}
			}}
		>
			<AlertDialogTrigger asChild>
				<Button
					size="icon"
					variant="ghost"
					className="size-7 text-destructive hover:text-destructive"
				>
					<TrashIcon className="size-3.5" />
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete comment?</AlertDialogTitle>

					<AlertDialogDescription>
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>

				{deleteCommentMutation.isError ? (
					<p className="text-sm text-destructive">
						{deleteCommentMutation.error.message}
					</p>
				) : null}

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>

					<AlertDialogAction
						onClick={event => {
							event.preventDefault()

							deleteCommentMutation.mutate(
								{
									commentId,
									postId
								},
								{
									onSuccess: () => {
										setOpen(false)
									}
								}
							)
						}}
					>
						{deleteCommentMutation.isPending ? 'Deleting...' : 'Delete'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
