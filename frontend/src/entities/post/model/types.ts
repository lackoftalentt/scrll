export type Post = {
	id: number
	author: string
	content: string
	image: string | null
	is_owner: boolean
	likes_count: number
	comments_count: number
	is_liked: boolean
	created_at: string
}
