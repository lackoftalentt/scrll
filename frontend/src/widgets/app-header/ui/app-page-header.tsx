'use client'

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

type AppPageHeaderProps = {
	title: string
}

export function AppPageHeader({ title }: AppPageHeaderProps) {
	return (
		<header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/75 backdrop-blur-xl">
			<div className="flex flex-1 items-center gap-2 px-3">
				<SidebarTrigger />
				<Separator
					orientation="vertical"
					className="mr-2 data-vertical:h-4 data-vertical:self-auto"
				/>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbPage className="line-clamp-1">{title}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	)
}
