'use client'

import {
	HouseSimpleIcon,
	ScrollIcon,
	UserCircleIcon
} from '@phosphor-icons/react/dist/ssr'

export const sidebarData = {
	teams: [
		{
			name: 'scrll.',
			logo: <ScrollIcon />,
			plan: 'Social Media'
		}
	],
	navMain: [
		{
			title: 'Home',
			url: '/',
			icon: <HouseSimpleIcon />
		},
		{
			title: 'Profile',
			url: '/profile',
			icon: <UserCircleIcon />
		}
	]
}
