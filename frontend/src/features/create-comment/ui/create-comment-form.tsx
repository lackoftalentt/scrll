'use client'

import { PaperPlaneTiltIcon } from '@phosphor-icons/react/dist/ssr'

import { useState } from 'react'

import { useCreateCommentMutation } from '../api/create-comment.mutation'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'

interface CreateCommentFormProps {
	postId: number
}

export function CreateCommentForm({ postId }: CreateCommentFormProps) {
	const [comment, setComment] = useState('')

	const createCommentMutation = useCreateCommentMutation()

	const handleSubmit = () => {
		const trimmed = comment.trim()

		if (!trimmed) {
			return
		}

		if (createCommentMutation.isPending) {
			return
		}

		createCommentMutation.mutate(
			{
				postId,

				payload: {
					content: trimmed
				}
			},
			{
				onSuccess: () => {
					setComment('')
				}
			}
		)
	}

	return (
		<div className="border-t p-4">
			<div className="flex items-center gap-2">
				<Input
					placeholder="Write a comment..."
					value={comment}
					onChange={e => setComment(e.target.value)}
					onKeyDown={event => {
						if (event.key === 'Enter') {
							handleSubmit()
						}
					}}
				/>

				<Button
					type="button"
					size="icon"
					disabled={!comment.trim() || createCommentMutation.isPending}
					onClick={handleSubmit}
				>
					<PaperPlaneTiltIcon className="size-4" />
				</Button>
			</div>

			{createCommentMutation.isError ? (
				<p className="mt-2 text-sm text-destructive">
					{createCommentMutation.error.message}
				</p>
			) : null}
		</div>
	)
}
