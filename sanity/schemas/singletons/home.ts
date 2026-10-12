import { HomeIcon } from '@sanity/icons/Home'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { helpField } from '@/sanity/plugins/help/HelpField'

export default defineType({
	name: 'home',
	title: 'Home',
	type: 'document',
	icon: HomeIcon as any,
	// Uncomment below to have edits publish automatically as you type
	// liveEdit: true,
	fields: [
		defineField({
			name: 'title',
			...helpField(
				'Default website title for browser tabs and search results. This does not replace the fixed homepage heading.',
				'settings',
			),
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'overview',
			...helpField(
				'Default search description for the website. Keep it concise; this does not replace the homepage paragraphs.',
				'settings',
			),
			title: 'Description',
			type: 'array',
			of: [
				// Paragraphs
				defineArrayMember({
					lists: [],
					marks: {
						annotations: [
							{
								name: 'link',
								type: 'object',
								title: 'Link',
								fields: [
									{
										name: 'href',
										type: 'url',
										title: 'Url',
									},
								],
							},
						],
						decorators: [
							{
								title: 'Italic',
								value: 'em',
							},
							{
								title: 'Strong',
								value: 'strong',
							},
						],
					},
					styles: [],
					type: 'block',
				}),
			],
			validation: (rule) => rule.max(155).required(),
		}),
		defineField({
			name: 'Posts',
			title: 'Posts for the website',
			...helpField(
				'Currently unused by the website. The posts page lists published posts by Publish Date; the homepage uses the latest post.',
				'content-map',
			),
			type: 'array',
			of: [
				defineArrayMember({
					type: 'reference',
					to: [{ type: 'post' }],
				}),
			],
		}),
	],
	preview: {
		select: {
			title: 'title',
		},
		prepare({ title }) {
			return {
				subtitle: 'Home',
				title,
			}
		},
	},
})
