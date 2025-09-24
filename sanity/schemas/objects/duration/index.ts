import { defineField } from 'sanity'

import { DurationInput } from './DurationInput'

export default defineField({
	type: 'object',
	name: 'duration',
	title: 'Publication Date',
	components: {
		input: DurationInput,
	},
	fields: [
		defineField({
			type: 'datetime',
			name: 'publishedAt',
			title: 'Published on',
		}),
	],
})
