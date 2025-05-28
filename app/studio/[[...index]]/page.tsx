/**
 * This route is responsible for the built-in authoring environment using Sanity Studio v3.
 * All routes under /studio will be handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import type { Metadata, Viewport } from 'next'

import Studio from './Studio'

export const metadata: Metadata = {
  title: 'Sanity Studio',
  description: 'Content authoring environment for the website.',
  // Prevent indexing of the studio by search engines
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // themeColor: '#000', // Optional: if you have a specific theme color for the studio
}

export const dynamic = 'force-static'



export default function StudioPage() {
  return <Studio />
}
