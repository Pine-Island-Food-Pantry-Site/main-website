/** @type {import('next').NextConfig} */

import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const config = {
	turbopack: {
		root: dirname(fileURLToPath(import.meta.url)),
	},
	// Fix for jsdom/isomorphic-dompurify in serverless environment
	serverExternalPackages: ['jsdom', 'isomorphic-dompurify'],
	images: {
		remotePatterns: [
			{ hostname: 'cdn.sanity.io' },
			{ hostname: 'source.unsplash.com' },
		],
	},
	typescript: {
		// TypeScript 7 no longer exposes the legacy compiler API used by Next's
		// integrated checker. The build script runs `tsc --noEmit` before Next.
		ignoreBuildErrors: true,
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	experimental: {
		taint: true,
	},
}

export default config
