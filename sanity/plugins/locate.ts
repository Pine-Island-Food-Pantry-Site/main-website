import { map, type Observable } from 'rxjs'
import { getPublishedId } from 'sanity'
import type { DocumentLocationResolver } from 'sanity/presentation'

import { latestPostIdQuery } from '@/sanity/lib/queries'

import {
	documentLocations,
	type LocatedDocument,
} from './presentation/documentLocations'

export const locate: DocumentLocationResolver = (params, context) => {
	if (params.type === 'home' || params.type === 'settings')
		return documentLocations(params.type)
	if (params.type !== 'page' && params.type !== 'post') return null

	const query =
		params.type === 'post'
			? `{
		"document": *[_id == $id][0]{_id, title, slug},
		"latestPostId": ${latestPostIdQuery}
	}`
			: `{"document": *[_id == $id][0]{_id, title, slug}}`
	const documents = context.documentStore.listenQuery(
		query,
		{ id: getPublishedId(params.id) },
		{
			perspective: params.perspectiveStack.length
				? params.perspectiveStack
				: 'drafts',
			variant: params.variant,
		},
	) as Observable<{ document: LocatedDocument | null; latestPostId?: string }>
	return documents.pipe(
		map(({ document, latestPostId }) =>
			documentLocations(params.type, document, latestPostId),
		),
	)
}
