const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export type AuthTokens = {
	access: string
	refresh: string
}

export type RegisterPayload = {
	username: string
	email: string
	password: string
}

export type LoginPayload = {
	username: string
	password: string
}

export class AuthError extends Error {
	constructor(message: string) {
		super(message)

		this.name = 'AuthError'
	}
}

async function parseError(response: Response) {
	const body = await response.json().catch(() => null)

	if (!body) {
		return 'Something went wrong.'
	}

	if (body.detail) {
		return body.detail
	}

	return 'Something went wrong.'
}

async function request<T>(path: string, body: unknown): Promise<T> {
	const response = await fetch(`${API_URL}${path}`, {
		method: 'POST',

		headers: {
			'Content-Type': 'application/json'
		},

		body: JSON.stringify(body)
	})

	if (!response.ok) {
		throw new AuthError(await parseError(response))
	}

	return response.json()
}

export function loginUser(payload: LoginPayload) {
	return request<AuthTokens>('/api/users/login/', payload)
}

export function registerUser(payload: RegisterPayload) {
	return request('/api/users/register/', payload)
}
