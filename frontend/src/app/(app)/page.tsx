import { AppPageHeader } from '@/widgets/app-header/ui/app-page-header'
import { Feed } from '@/widgets/feed/ui/feed'

export default function Home() {
	return (
		<>
			<AppPageHeader title="Home" />
			<main className="w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
				<Feed />
			</main>
		</>
	)
}
