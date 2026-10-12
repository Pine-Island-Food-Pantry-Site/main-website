import { defineField, defineType } from 'sanity'

import { helpField } from '@/sanity/plugins/help/HelpField'

export default defineType({
	name: 'milestone',
	title: 'Milestone',
	type: 'object',
	fields: [
		defineField({
			type: 'string',
			name: 'title',
			title: 'Title',
			validation: (rule) => rule.required(),
		}),
		defineField({
			type: 'string',
			name: 'description',
			title: 'Description',
		}),
		defineField({
			name: 'image',
			title: 'Image',
			type: 'image',
			...helpField(
				'Small thumbnail beside this milestone. Preview its square crop.',
				'images',
			),
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: 'tags',
			title: 'Tags',
			type: 'array',
			description: 'Optional labels displayed beside this milestone.',
			of: [{ type: 'string' }],
			options: {
				layout: 'tags',
			},
		}),
		defineField({
			type: 'duration',
			name: 'duration',
			title: 'Duration',
			...helpField(
				'The website currently does not display this date correctly in timeline year labels. Include essential dates in Description and check preview.',
				'timelines',
			),
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: {
			duration: 'duration',
			image: 'image',
			title: 'title',
		},
		prepare({ duration, image, title }) {
			return {
				media: image,
				subtitle: [
					duration?.publishedAt && new Date(duration.publishedAt).getFullYear(),
				]
					.filter(Boolean)
					.join(' - '),
				title,
			}
		},
	},
})
