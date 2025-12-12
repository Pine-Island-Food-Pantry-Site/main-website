/** @type {import('next').NextConfig} */

import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const config = {
	turbopack: {
		root: dirname(fileURLToPath(import.meta.url)),
	},
	images: {
		remotePatterns: [
			{ hostname: 'cdn.sanity.io' },
			{ hostname: 'source.unsplash.com' },
		],
	},
	typescript: {
		// Set this to false if you want production builds to abort if there's type errors
		ignoreBuildErrors: process.env.VERCEL_ENV === 'production',
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
