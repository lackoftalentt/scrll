import { useQuery } from '@tanstack/react-query'

import { getUserByUsername } from '../api/user.api'

import { useAuthStore } from '@/features/auth/model/auth-store'

export function useUserProfile(username: string) {
	const accessToken = useAuthStore(s => s.accessToken)

	return useQuery({
		queryKey: ['user-profile', accessToken, username],
		queryFn: () => getUserByUsername(accessToken ?? '', username),
		enabled: Boolean(accessToken && username)
	})
}
