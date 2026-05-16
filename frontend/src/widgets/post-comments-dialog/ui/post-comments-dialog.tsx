'use client'

import { ChatCircleIcon } from '@phosphor-icons/react/dist/ssr'

import Link from 'next/link'

import { useState } from 'react'

import { CommentsList } from '@/entities/comment/ui/comments-list'

import type { Post } from '@/entities/post/model/types'

import { CreateCommentForm } from '@/features/create-comment/ui/create-comment-form'

import { Button } from '@/components/ui/button'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'

type PostCommentsDialogProps = {
	post: Post
}

const dateFormatter = new Intl.DateTimeFormat('en', {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
})

export function PostCommentsDialog({ post }: PostCommentsDialogProps) {
	const [open, setOpen] = useState(false)
	const authorHref = post.is_owner
		? '/profile'
		: `/users/${encodeURIComponent(post.author)}`

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
				>
					<ChatCircleIcon className="size-4" />

					{post.comments_count}
				</Button>
			</DialogTrigger>

			<DialogContent className="flex h-[650px] max-w-2xl flex-col gap-0 overflow-hidden p-0">
				<div className="border-b p-6">
					<DialogHeader>
						<DialogTitle>Comments</DialogTitle>

						<DialogDescription>View and join the discussion.</DialogDescription>
					</DialogHeader>

					<div className="mt-4 rounded-lg border border-border/70 bg-muted/40 p-4">
						<div className="flex items-center justify-between">
							<Link
								href={authorHref}
								className="text-sm font-medium transition-colors hover:text-primary"
							>
								{post.author}
							</Link>

							<time
								dateTime={post.created_at}
								className="text-xs text-muted-foreground"
							>
								{dateFormatter.format(new Date(post.created_at))}
							</time>
						</div>

						<p className="mt-2 text-sm leading-6 text-foreground/90">
							{post.content}
						</p>

						{post.image ? (
							<img
								src={post.image}
								alt=""
								className="mt-4 max-h-72 w-full rounded-md border border-border/60 object-cover"
							/>
						) : null}
					</div>
				</div>

				<div className="flex-1 overflow-y-auto px-6 py-4">
					<CommentsList
						postId={post.id}
						enabled={open}
					/>
				</div>

				<CreateCommentForm postId={post.id} />
			</DialogContent>
		</Dialog>
	)
}
