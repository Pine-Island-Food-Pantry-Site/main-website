import { BookIcon } from '@sanity/icons/Book'
import { Card, Spinner } from '@sanity/ui'
import dynamic from 'next/dynamic'
import { definePlugin } from 'sanity'
import { route } from 'sanity/router'

import type { HelpOptions } from './HelpTool'

const HelpTool = dynamic(() => import('./HelpTool'), {
	loading: () => (
		<Card padding={5}>
			<Spinner />
			<p role="status">Loading the guide…</p>
		</Card>
	),
})

export const helpPlugin = definePlugin<HelpOptions>((options) => ({
	name: 'cms-help',
	tools: [
		{
			name: 'help',
			title: 'Help & Guide',
			icon: BookIcon,
			component: HelpTool,
			options,
			router: route.create('/', [route.create('/:article')]),
			canHandleIntent: (intent) => intent === 'help',
			getIntentState: (_intent, params) => ({
				article: params.article || 'start',
			}),
		},
	],
}))
