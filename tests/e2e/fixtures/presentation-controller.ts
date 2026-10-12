import { createConnectionMachine, createController } from '@sanity/comlink'
import {
	createCompatibilityActors,
	type LoaderControllerMsg,
	type LoaderNodeMsg,
	type VisualEditingControllerMsg,
	type VisualEditingNodeMsg,
} from '@sanity/presentation-comlink'
import type { ClientPerspective, ContentSourceMap } from 'next-sanity'

function previewPath(requestedPath: string | null): string {
	// Return constants so the fixture cannot load arbitrary URLs or script schemes.
	switch (requestedPath) {
		case '/':
			return '/'
		case '/posts?search=fixture':
			return '/posts?search=fixture'
		case '/fixture-custom-page':
			return '/fixture-custom-page'
		case '/posts/fixture-pantry-announcement':
			return '/posts/fixture-pantry-announcement'
		default:
			throw new Error('The preview fixture only supports known local routes')
	}
}

const path = previewPath(new URL(location.href).searchParams.get('path'))
const iframe = document.querySelector<HTMLIFrameElement>('#preview')
if (!iframe?.contentWindow) throw new Error('Preview iframe is missing')
const controller = createController({ targetOrigin: location.origin })
controller.addTarget(iframe.contentWindow)
const loaders = controller.createChannel<LoaderControllerMsg, LoaderNodeMsg>(
	{
		name: 'presentation',
		connectTo: 'loaders',
		heartbeat: true,
	},
	createConnectionMachine<LoaderControllerMsg, LoaderNodeMsg>().provide({
		actors: createCompatibilityActors(),
	}),
)
const overlays = controller.createChannel<
	VisualEditingControllerMsg,
	VisualEditingNodeMsg
>(
	{
		name: 'presentation',
		connectTo: 'visual-editing',
		heartbeat: true,
	},
	createConnectionMachine<
		VisualEditingControllerMsg,
		VisualEditingNodeMsg
	>().provide({ actors: createCompatibilityActors() }),
)

// This controller only supplies in-memory results; it never calls the mutation API.
let perspective: ClientPerspective = 'drafts'
let revision = 1
let empty = false
const queries = new Map<
	string,
	{
		projectId: string
		dataset: string
		query: string
		params: Record<string, string>
	}
>()
const block = (text: string) => [
	{
		_type: 'block',
		_key: 'intro',
		style: 'normal',
		markDefs: [],
		children: [{ _type: 'span', _key: 'text', text, marks: [] }],
	},
]

function fixturePost() {
	return {
		_id: 'fixture-post-45',
		_type: 'post',
		title: 'Fixture pantry announcement',
		slug: 'fixture-pantry-announcement',
		overview: block(
			`${perspective === 'published' ? 'Published' : 'Draft'} fixture overview ${revision}`,
		),
		description: block('Fixture post body'),
		tags: ['fixture'],
		duration: { publishedAt: '2026-10-12T12:00:00Z' },
		coverImage: {
			_type: 'image',
			asset: {
				_type: 'reference',
				_ref:
					revision === 1
						? 'image-493d04296077d02b00be8ac21a5a3bdb8ea1b359-839x704-jpg'
						: 'image-ed6a784dc9bd4637befaa643ed1238c4737bf9bb-1598x764-png',
			},
		},
	}
}

function sourceMap(
	document: { _id: string; _type: string },
	fields: string[],
	prefix = '',
): ContentSourceMap {
	return {
		documents: [{ _id: document._id, _type: document._type }],
		paths: fields.map((field) => `$['${field}']`),
		mappings: Object.fromEntries(
			fields.map((field, path) => [
				`$${prefix}['${field}']`,
				{
					type: 'value' as const,
					source: { type: 'documentValue' as const, document: 0, path },
				},
			]),
		),
	}
}

function publishResult(query: {
	projectId: string
	dataset: string
	query: string
	params: Record<string, string>
}) {
	let result: unknown
	let resultSourceMap: ContentSourceMap
	const post = fixturePost()
	if (query.query.includes('_type == "settings"')) {
		const settings = {
			_id: 'settings',
			_type: 'settings',
			footer: block('Fixture pantry footer'),
		}
		result = settings
		resultSourceMap = sourceMap(settings, ['footer'])
	} else if (query.query.includes('_type == "page"')) {
		const page = {
			_id: 'fixture-page-45',
			_type: 'page',
			title: 'Fixture custom page',
			overview: block('Fixture page overview'),
			body: block('Fixture page body'),
		}
		result = page
		resultSourceMap = sourceMap(page, ['title', 'overview', 'body'])
	} else {
		const single = query.query.includes('[0]')
		result = empty ? null : single ? post : [post]
		resultSourceMap = sourceMap(
			post,
			['title', 'overview', 'description', 'coverImage'],
			single ? '' : '[0]',
		)
	}
	loaders.post('loader/query-change', {
		...query,
		perspective,
		result,
		resultSourceMap,
	})
}

loaders.on('loader/query-listen', (data) => {
	const query = data as unknown as {
		projectId: string
		dataset: string
		query: string
		params: Record<string, string>
	}
	queries.set(JSON.stringify([query.query, query.params]), query)
	if (data.perspective !== perspective)
		loaders.post('loader/perspective', {
			projectId: query.projectId,
			dataset: query.dataset,
			perspective,
		})
	publishResult(query)
})
overlays.on('visual-editing/focus', (data) => {
	window.presentationFixture.focus = data
})
overlays.onStatus((event) => {
	window.presentationFixture.connected = event.status === 'connected'
})
window.presentationFixture = {
	connected: false,
	focus: undefined,
	update: () => {
		revision += 1
		for (const query of queries.values()) publishResult(query)
	},
	clearLatest: () => {
		empty = true
		for (const query of queries.values()) publishResult(query)
	},
	setPerspective: (value: 'published' | 'drafts') => {
		perspective = value
		overlays.post('presentation/perspective', { perspective })
		for (const query of queries.values())
			loaders.post('loader/perspective', {
				projectId: query.projectId,
				dataset: query.dataset,
				perspective,
			})
		for (const query of queries.values()) publishResult(query)
	},
}
loaders.start()
overlays.start()
iframe.src = path

declare global {
	interface Window {
		presentationFixture: {
			connected: boolean
			focus: unknown
			update: () => void
			clearLatest: () => void
			setPerspective: (value: 'published' | 'drafts') => void
		}
	}
}
