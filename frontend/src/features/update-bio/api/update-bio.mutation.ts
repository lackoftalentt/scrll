'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
	updateBio,
	type UpdateBioPayload
} from '@/entities/user/api/user.api'

import { useAuthStore } from '@/features/auth/model/auth-store'

export function useUpdateBioMutation() {
	const accessToken = useAuthStore(s => s.accessToken)
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: UpdateBioPayload) =>
			updateBio(accessToken ?? '', payload),

		onSuccess: user => {
			queryClient.setQueryData(['current-user', accessToken], user)
		}
	})
}
