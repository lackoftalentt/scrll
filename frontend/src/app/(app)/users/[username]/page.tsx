import { UserProfilePage as UserProfilePageView } from '@/pages-fsd/user-profile/ui/user-profile-page'

type UserPageProps = {
	params: Promise<{
		username: string
	}>
}

export default async function UserPage({ params }: UserPageProps) {
	const { username } = await params

	return <UserProfilePageView username={decodeURIComponent(username)} />
}
