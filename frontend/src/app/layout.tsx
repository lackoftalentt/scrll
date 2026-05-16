import type { Metadata } from 'next'
import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'

import { AuthProvider } from '@/features/auth/model/auth-provider'
import { QueryProvider } from '@/shared/providers/query-provider'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
	subsets: ['latin'],
	variable: '--font-sans'
})

const mono = JetBrains_Mono({
	subsets: ['latin'],
	variable: '--font-mono'
})

export const metadata: Metadata = {
	title: 'SCRLL',
	description: 'SCRLL workspace'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="en"
			className={`${jakarta.variable} ${mono.variable} dark h-full antialiased`}
		>
			<body className="min-h-screen font-sans">
				<QueryProvider>
					<AuthProvider>{children}</AuthProvider>
				</QueryProvider>
			</body>
		</html>
	)
}
