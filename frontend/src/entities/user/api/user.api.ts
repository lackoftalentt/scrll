import type { User } from '../model/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export type UpdateBioPayload = {
	bio: string
}

export class UserApiError extends Error {
	constructor(message: string) {
		super(message)

		this.name = 'UserApiError'
	}
}

async function parseError(response: Response) {
	const body = await response.json().catch(() => null)

	if (body?.detail) {
		return body.detail
	}

	return 'Failed to load profile.'
}

export async function getCurrentUser(accessToken: string): Promise<User> {
	const response = await fetch(`${API_URL}/api/users/me/`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	})

	if (!response.ok) {
		throw new UserApiError(await parseError(response))
	}

	return response.json()
}

export async function getUserByUsername(
	accessToken: string,
	username: string
): Promise<User> {
	const response = await fetch(
		`${API_URL}/api/users/${encodeURIComponent(username)}/`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		}
	)

	if (!response.ok) {
		throw new UserApiError(await parseError(response))
	}

	return response.json()
}

export async function updateBio(
	accessToken: string,
	payload: UpdateBioPayload
): Promise<User> {
	const response = await fetch(`${API_URL}/api/users/me/`, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	})

	if (!response.ok) {
		throw new UserApiError(await parseError(response))
	}

	return response.json()
}
