'use client'

import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from '@/components/ui/sidebar'

export function NavMain({
	items
}: {
	items: {
		title: string
		url: string
		icon: React.ReactNode
		isActive?: boolean
	}[]
}) {
	return (
		<SidebarMenu className="gap-2">
			{items.map(item => (
				<SidebarMenuItem key={item.title}>
					<SidebarMenuButton
						asChild
						isActive={item.isActive}
						className="h-9 px-4"
					>
						<a
							href={item.url}
							className="flex items-center gap-4"
						>
							<span>{item.icon}</span>

							<span className="text-base font-semibold">{item.title}</span>
						</a>
					</SidebarMenuButton>
				</SidebarMenuItem>
			))}
		</SidebarMenu>
	)
}
