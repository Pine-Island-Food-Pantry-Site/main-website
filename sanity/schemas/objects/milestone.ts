import { defineField, defineType } from 'sanity'

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
			description: "This image will be used as the posts's cover image.",
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: 'tags',
			title: 'Tags',
			type: 'array',
			description:
				'Tags to help categorize the post. This can help with search later on.',
			of: [{ type: 'string' }],
			options: {
				layout: 'tags',
			},
		}),
		defineField({
			type: 'duration',
			name: 'duration',
			title: 'Duration',
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
