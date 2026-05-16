import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'

import { AppSidebar } from '@/widgets/app-sidebar/ui/app-sidebar'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

const jakarta = Plus_Jakarta_Sans({
	subsets: ['latin'],
	variable: '--font-jakarta'
})

const mono = JetBrains_Mono({
	subsets: ['latin'],
	variable: '--font-jetbrains'
})

export default function AppLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div
			className={`${jakarta.variable} ${mono.variable} min-h-svh max-w-[1540] font-sans`}
		>
			<SidebarProvider>
				<AppSidebar />

				<div className="flex w-full">
					<SidebarInset className="flex-1">{children}</SidebarInset>
				</div>
			</SidebarProvider>
		</div>
	)
}
