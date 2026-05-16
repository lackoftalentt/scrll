import { create } from 'zustand'

import type { AuthTokens } from '../api/auth.api'

import {
	clearTokens,
	getAccessToken,
	getRefreshToken,
	saveTokens
} from '@/shared/lib/token-storage'

interface AuthStore {
	isAuth: boolean
	isInitialized: boolean

	accessToken: string | null
	refreshToken: string | null

	initialize: () => void

	setAuth: (tokens: AuthTokens) => void

	logout: () => void
}

export const useAuthStore = create<AuthStore>(set => ({
	isAuth: false,
	isInitialized: false,

	accessToken: null,
	refreshToken: null,

	initialize: () => {
		const accessToken = getAccessToken()

		const refreshToken = getRefreshToken()

		set({
			isAuth: Boolean(accessToken),
			isInitialized: true,
			accessToken,
			refreshToken
		})
	},

	setAuth: tokens => {
		saveTokens(tokens.access, tokens.refresh)

		set({
			isAuth: true,
			isInitialized: true,

			accessToken: tokens.access,

			refreshToken: tokens.refresh
		})
	},

	logout: () => {
		clearTokens()

		set({
			isAuth: false,
			isInitialized: true,

			accessToken: null,
			refreshToken: null
		})
	}
}))
