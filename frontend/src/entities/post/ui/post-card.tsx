import Link from 'next/link'

import type { Post } from '../model/types'

import { EditPostDialog } from '@/features/edit-post/ui/edit-post-dialog'

import { DeletePostButton } from '@/features/delete-post/ui/delete-post-button'

import { LikePostButton } from '@/features/like-post/ui/like-post-button'

import { PostCommentsDialog } from '@/widgets/post-comments-dialog/ui/post-comments-dialog'

type PostCardProps = {
	post: Post
	canManage?: boolean
}

const dateFormatter = new Intl.DateTimeFormat('en', {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
})

export function PostCard({ post, canManage = false }: PostCardProps) {
	const imageUrl = post.image
	const authorHref = post.is_owner
		? '/profile'
		: `/users/${encodeURIComponent(post.author)}`

	return (
		<article className="rounded-lg border border-border/70 bg-card/80 p-4 shadow-sm shadow-black/20 backdrop-blur transition-colors hover:border-primary/35">
			<div className="mb-3 flex items-start justify-between gap-3">
				<div>
					<Link
						href={authorHref}
						className="block text-sm font-semibold transition-colors hover:text-primary"
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

				{canManage ? (
					<div className="flex items-center gap-2">
						<EditPostDialog post={post} />

						<DeletePostButton postId={post.id} />
					</div>
				) : null}
			</div>

			<p className="text-sm leading-6 text-foreground/90">{post.content}</p>

			{imageUrl ? (
				<img
					src={imageUrl}
					alt=""
					className="mt-4 max-h-[500px] w-full rounded-md border border-border/60 object-cover"
				/>
			) : null}

			<div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
				<LikePostButton
					postId={post.id}
					isLiked={post.is_liked}
					likesCount={post.likes_count}
				/>

				<PostCommentsDialog post={post} />
			</div>
		</article>
	)
}
