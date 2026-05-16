import { API_URL } from '@/shared/api/constants'

// TODO: refactor

export interface CreateCommentPayload {
	content: string
}

export interface EditCommentPayload {
	content: string
}

export async function getComments(token: string, postId: number) {
	const response = await fetch(`${API_URL}/api/comments/posts/${postId}/`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	if (!response.ok) {
		throw new Error('Failed to fetch comments')
	}

	return response.json()
}

export async function createComment(
	token: string,
	postId: number,
	payload: CreateCommentPayload
) {
	const response = await fetch(`${API_URL}/api/comments/posts/${postId}/`, {
		method: 'POST',

		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},

		body: JSON.stringify(payload)
	})

	if (!response.ok) {
		throw new Error('Failed to create comment')
	}

	return response.json()
}

export async function editComment(
	token: string,
	commentId: number,
	payload: EditCommentPayload
) {
	const response = await fetch(`${API_URL}/api/comments/${commentId}/edit/`, {
		method: 'PATCH',

		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},

		body: JSON.stringify(payload)
	})

	if (!response.ok) {
		throw new Error('Failed to update comment')
	}

	return response.json()
}

export async function deleteComment(token: string, commentId: number) {
	const response = await fetch(`${API_URL}/api/comments/${commentId}/`, {
		method: 'DELETE',

		headers: {
			Authorization: `Bearer ${token}`
		}
	})

	if (!response.ok) {
		throw new Error('Failed to delete comment')
	}
}
