import '../styles/index.css'

import { IBM_Plex_Mono, Inter, PT_Serif } from 'next/font/google'

const themeScript = `
(() => {
	try {
		const savedTheme = localStorage.getItem('theme-preference')
		const theme = ['light', 'dark', 'auto'].includes(savedTheme) ? savedTheme : 'auto'
		document.documentElement.dataset.theme = theme
		document.documentElement.style.colorScheme = theme === 'auto' ? 'light dark' : theme
	} catch {
		document.documentElement.dataset.theme = 'auto'
		document.documentElement.style.colorScheme = 'light dark'
	}
})()
`

const serif = PT_Serif({
	variable: '--font-serif',
	style: ['normal', 'italic'],
	subsets: ['latin'],
	weight: ['400', '700'],
})
const sans = Inter({
	variable: '--font-sans',
	subsets: ['latin'],
	// @todo: understand why extrabold (800) isn't being respected when explicitly specified in this weight array
	// weight: ['500', '700', '800'],
})
const mono = IBM_Plex_Mono({
	variable: '--font-mono',
	subsets: ['latin'],
	weight: ['500', '700'],
})

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html
			lang="en"
			className={`${mono.variable} ${sans.variable} ${serif.variable}`}
			suppressHydrationWarning
		>
			<head>
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: This static script applies a saved theme before first paint. */}
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			<body>{children}</body>
		</html>
	)
}
