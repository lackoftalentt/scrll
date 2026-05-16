'use client'

import * as React from 'react'

import { Sidebar, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'

import { sidebarData } from '@/widgets/app-sidebar/model/sidebar-data'
import { NavMain } from '@/widgets/app-sidebar/ui/nav-main'
import { TeamSwitcher } from '@/widgets/app-sidebar/ui/team-switcher'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<>
			<Sidebar
				className="border-r border-sidebar-border/80"
				{...props}
			>
				<SidebarHeader>
					<TeamSwitcher teams={sidebarData.teams} />
					<NavMain items={sidebarData.navMain} />
				</SidebarHeader>

				<SidebarRail />
			</Sidebar>

			<div className="fixed right-0 top-0 h-svh w-[320px] border-l border-border bg-[#020817]">
				<div>
					<p>@morninginheaven</p>
					<p className="text-7xl font-black uppercase tracking-[14px] text-cyan-500/10 [writing-mode:vertical-rl]">
						doomscroll
					</p>
				</div>
			</div>
		</>
	)
}
