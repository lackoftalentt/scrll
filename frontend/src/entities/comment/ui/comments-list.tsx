'use client'

import { useComments } from '../model/use-comments'

import { CommentCard } from './comment-card'

interface CommentsListProps {
	postId: number
	enabled?: boolean
}

export function CommentsList({ postId, enabled = true }: CommentsListProps) {
	const commentsQuery = useComments(postId, enabled)

	if (commentsQuery.isLoading) {
		return (
			<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
				Loading comments...
			</div>
		)
	}

	if (commentsQuery.isError) {
		return (
			<div className="flex h-full items-center justify-center text-sm text-destructive">
				{commentsQuery.error.message}
			</div>
		)
	}

	if (
		!commentsQuery.data?.results ||
		commentsQuery.data?.results.length === 0
	) {
		return (
			<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
				No comments yet.
			</div>
		)
	}

	return (
		<div className="space-y-4">
			{commentsQuery.data.results.map(comment => (
				<CommentCard
					key={comment.id}
					comment={comment}
					postId={postId}
				/>
			))}
		</div>
	)
}
