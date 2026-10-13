import type { DocumentLocationsState } from 'sanity/presentation'

import { resolveHref } from '../../lib/resolveHref.mjs'

export interface LocatedDocument {
	_id: string
	title?: string
	slug?: { current?: string }
}

const reservedPageSlugs = new Set([
	'about',
	'contact',
	'posts',
	'studio',
	'api',
])

export function documentLocations(
	type: string,
	document?: LocatedDocument | null,
	latestPostId?: string,
): DocumentLocationsState | null {
	if (type === 'home' || type === 'settings')
		return {
			locations: [{ title: 'Homepage', href: '/' }],
			tone: 'caution',
			message:
				type === 'home'
					? 'The site title and description are used in metadata across the website. Homepage copy is maintained separately.'
					: 'Footer text and the default sharing image are used across the website.',
		}
	if (type !== 'page' && type !== 'post') return null
	if (type === 'page' && reservedPageSlugs.has(document?.slug?.current || ''))
		return {
			tone: 'caution',
			message:
				'This address belongs to a fixed website route. Choose a different page slug to preview this content.',
		}
	const href = resolveHref(type, document?.slug?.current)
	const locations = href
		? [{ title: document?.title || (type === 'post' ? 'Post' : 'Page'), href }]
		: []
	if (type === 'post') {
		locations.push({ title: 'Posts listing', href: '/posts' })
		if (document?._id === latestPostId)
			locations.push({ title: 'Homepage latest update', href: '/' })
	}
	return {
		locations,
		...(!href
			? {
					tone: 'caution' as const,
					message:
						'Generate a slug to preview this document at its own address.',
				}
			: {}),
	}
}
