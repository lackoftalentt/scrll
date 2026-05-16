import { useQuery } from '@tanstack/react-query'

import { getPosts } from '../api/post.api'

import { useAuthStore } from '@/features/auth/model/auth-store'

export function usePosts() {
	const accessToken = useAuthStore(s => s.accessToken)

	return useQuery({
		queryKey: ['posts', accessToken],
		queryFn: () => getPosts(accessToken ?? ''),
		enabled: Boolean(accessToken)
	})
}
