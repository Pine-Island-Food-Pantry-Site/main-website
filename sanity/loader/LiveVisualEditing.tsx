'use client'

import { useLiveMode } from '@sanity/react-loader'
import { useVisualEditingEnvironment } from '@sanity/visual-editing/react'
import { useEffect } from 'react'

import { client } from '@/sanity/lib/client'

// Always enable stega in Live Mode
const stegaClient = client.withConfig({ stega: true, perspective: 'drafts' })

export default function LiveEditingOverlay() {
	useLiveMode({ client: stegaClient })
	const environment = useVisualEditingEnvironment()
	useEffect(() => {
		// Wait for the overlay handshake: Presentation can also open a preview window.
		if (environment === 'standalone') {
			location.replace('/api/disable-draft')
		}
	}, [environment])

	return null
}
