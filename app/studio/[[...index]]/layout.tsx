'use client'

import Script from 'next/script'

const bridgeScript = 'https://core.sanity-cdn.com/bridge.js'

export default function StudioLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<Script src={bridgeScript} strategy="afterInteractive" />
			{children}
		</>
	)
}
