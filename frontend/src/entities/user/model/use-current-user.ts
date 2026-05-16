import { useQuery } from '@tanstack/react-query'

import { getCurrentUser } from '../api/user.api'

import { useAuthStore } from '@/features/auth/model/auth-store'

export function useCurrentUser() {
	const accessToken = useAuthStore(s => s.accessToken)

	return useQuery({
		queryKey: ['current-user', accessToken],
		queryFn: () => getCurrentUser(accessToken ?? ''),
		enabled: Boolean(accessToken)
	})
}
