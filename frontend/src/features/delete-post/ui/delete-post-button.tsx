'use client'

import { TrashIcon } from '@phosphor-icons/react/dist/ssr'

import { useState } from 'react'

import { useDeletePostMutation } from '../api/delete-post.mutation'

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

interface DeletePostButtonProps {
	postId: number
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
	const [open, setOpen] = useState(false)

	const deletePostMutation = useDeletePostMutation()

	const handleDelete = () => {
		deletePostMutation.mutate(postId, {
			onSuccess: () => {
				setOpen(false)
			}
		})
	}

	return (
		<AlertDialog
			open={open}
			onOpenChange={nextOpen => {
				setOpen(nextOpen)

				if (!nextOpen) {
					deletePostMutation.reset()
				}
			}}
		>
			<AlertDialogTrigger asChild>
				<Button
					size="icon"
					variant="ghost"
					className="text-destructive hover:text-destructive"
					disabled={deletePostMutation.isPending}
				>
					<TrashIcon className="size-4" />
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete post?</AlertDialogTitle>

					<AlertDialogDescription>
						This action cannot be undone. The post will be permanently deleted.
					</AlertDialogDescription>
				</AlertDialogHeader>

				{deletePostMutation.isError ? (
					<p className="text-sm text-destructive">
						{deletePostMutation.error.message}
					</p>
				) : null}

				<AlertDialogFooter>
					<AlertDialogCancel disabled={deletePostMutation.isPending}>
						Cancel
					</AlertDialogCancel>

					<AlertDialogAction
						disabled={deletePostMutation.isPending}
						onClick={event => {
							event.preventDefault()

							handleDelete()
						}}
					>
						{deletePostMutation.isPending ? 'Deleting...' : 'Delete'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
