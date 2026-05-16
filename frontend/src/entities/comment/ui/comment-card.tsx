'use client'

import Link from 'next/link'

import type { Comment } from '../model/types'

import { useCurrentUser } from '@/entities/user/model/use-current-user'

import { DeleteCommentButton } from '@/features/delete-comment/ui/delete-comment-button'

import { EditCommentDialog } from '@/features/edit-comment/ui/edit-comment-dialog'

interface CommentCardProps {
	comment: Comment
	postId: number
}

const dateFormatter = new Intl.DateTimeFormat('en', {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
})

export function CommentCard({ comment, postId }: CommentCardProps) {
	const currentUserQuery = useCurrentUser()

	const authorHref =
		currentUserQuery.data?.username === comment.author
			? '/profile'
			: `/users/${encodeURIComponent(comment.author)}`

	return (
		<div className="group flex gap-2">
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2">
					<Link
						href={authorHref}
						className="text-sm font-medium transition-colors hover:text-primary"
					>
						{comment.author}
					</Link>

					<time
						dateTime={comment.created_at}
						className="text-xs text-muted-foreground"
					>
						{dateFormatter.format(new Date(comment.created_at))}
					</time>
				</div>

				<p className="mt-1 wrap-break-word text-sm leading-6 text-foreground/90">
					{comment.content}
				</p>
			</div>

			<div className="flex items-start opacity-0 transition-opacity group-hover:opacity-100">
				<EditCommentDialog
					comment={comment}
					postId={postId}
				/>

				<DeleteCommentButton
					commentId={comment.id}
					postId={postId}
				/>
			</div>
		</div>
	)
}
