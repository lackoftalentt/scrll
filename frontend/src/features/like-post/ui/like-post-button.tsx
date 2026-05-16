'use client'

import { HeartIcon } from '@phosphor-icons/react/dist/ssr'

import { useLikePostMutation } from '../api/like-post.mutation'

import { Button } from '@/components/ui/button'

interface LikePostButtonProps {
	postId: number
	isLiked: boolean
	likesCount: number
}

export function LikePostButton({
	postId,
	isLiked,
	likesCount
}: LikePostButtonProps) {
	const likePostMutation = useLikePostMutation()

	return (
		<Button
			type="button"
			variant="ghost"
			size="sm"
			className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
			disabled={likePostMutation.isPending}
			onClick={() => likePostMutation.mutate(postId)}
		>
			<HeartIcon
				weight={isLiked ? 'fill' : 'regular'}
				className={isLiked ? 'size-4 text-destructive' : 'size-4'}
			/>

			{likesCount}
		</Button>
	)
}
