'use client'

import { useMutation } from '@tanstack/react-query'

import { registerUser, type RegisterPayload } from './auth.api'

export function useRegisterMutation() {
	return useMutation({
		mutationFn: (payload: RegisterPayload) => registerUser(payload)
	})
}
