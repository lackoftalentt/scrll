'use client'

import { useMutation } from '@tanstack/react-query'

import { loginUser, type LoginPayload } from './auth.api'

import { useAuthStore } from '../model/auth-store'

export function useLoginMutation() {
	const setAuth = useAuthStore(s => s.setAuth)

	return useMutation({
		mutationFn: (payload: LoginPayload) => loginUser(payload),

		onSuccess: tokens => {
			setAuth(tokens)
		}
	})
}
