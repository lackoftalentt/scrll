import type { Post } from '../model/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export type CreatePostPayload = {
	content: string
	image?: File | null
}

export type UpdatePostPayload = {
	content?: string
	image?: File | null
}

export type ToggleLikeResponse = {
	liked: boolean
	likes_count: number
}

export class PostApiError extends Error {
	constructor(message: string) {
		super(message)

		this.name = 'PostApiError'
	}
}

async function parseError(response: Response) {
	const body = await response.json().catch(() => null)

	if (body?.detail) {
		return body.detail
	}

	if (body?.content?.[0]) {
		return body.content[0]
	}

	return 'Failed to load posts.'
}

export async function getPosts(accessToken: string): Promise<Post[]> {
	const response = await fetch(`${API_URL}/api/posts/`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	})

	if (!response.ok) {
		throw new PostApiError(await parseError(response))
	}

	return response.json()
}

export async function createPost(
	accessToken: string,
	payload: CreatePostPayload
): Promise<Post> {
	const formData = new FormData()

	formData.append('content', payload.content)

	if (payload.image) {
		formData.append('image', payload.image)
	}

	const response = await fetch(`${API_URL}/api/posts/`, {
		method: 'POST',

		headers: {
			Authorization: `Bearer ${accessToken}`
		},

		body: formData
	})

	if (!response.ok) {
		throw new PostApiError(await parseError(response))
	}

	return response.json()
}

export async function deletePost(
	accessToken: string,
	postId: number
): Promise<void> {
	const response = await fetch(`${API_URL}/api/posts/${postId}/`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	})

	if (!response.ok) {
		throw new PostApiError(await parseError(response))
	}
}

export async function updatePost(
	accessToken: string,
	postId: number,
	payload: UpdatePostPayload
): Promise<Post> {
	const formData = new FormData()

	if (payload.content !== undefined) {
		formData.append('content', payload.content)
	}

	if (payload.image) {
		formData.append('image', payload.image)
	}

	const response = await fetch(`${API_URL}/api/posts/${postId}/`, {
		method: 'PATCH',

		headers: {
			Authorization: `Bearer ${accessToken}`
		},

		body: formData
	})

	if (!response.ok) {
		throw new PostApiError(await parseError(response))
	}

	return response.json()
}

export async function togglePostLike(
	accessToken: string,
	postId: number
): Promise<ToggleLikeResponse> {
	const response = await fetch(`${API_URL}/api/likes/posts/${postId}/toggle/`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	})

	if (!response.ok) {
		throw new PostApiError(await parseError(response))
	}

	return response.json()
}
