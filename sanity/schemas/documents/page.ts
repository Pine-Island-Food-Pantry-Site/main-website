import { DocumentIcon } from '@sanity/icons/Document'
import { ImageIcon } from '@sanity/icons/Image'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { helpField } from '@/sanity/plugins/help/HelpField'

export default defineType({
	type: 'document',
	name: 'page',
	title: 'Page',
	icon: DocumentIcon as any,
	fields: [
		defineField({
			type: 'string',
			name: 'title',
			title: 'Title',
			validation: (rule) => rule.required(),
		}),
		defineField({
			type: 'slug',
			name: 'slug',
			title: 'Slug',
			...helpField(
				'Page address on the website. Avoid existing routes such as about, contact, posts, studio, and api. Publishing does not add a menu link.',
				'pages',
			),
			options: {
				source: 'title',
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'overview',
			...helpField(
				'Short summary shown below the page title and used for its search description.',
				'pages',
			),
			title: 'Overview',
			type: 'array',
			of: [
				// Paragraphs
				defineArrayMember({
					lists: [],
					marks: {
						annotations: [],
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
			type: 'array',
			name: 'body',
			title: 'Body',
			...helpField(
				'Main page content. Add text, links, photos, and timeline blocks using the available controls.',
				'formatting',
			),
			of: [
				// Paragraphs
				defineArrayMember({
					type: 'block',
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
					},
					styles: [],
				}),
				// Custom blocks
				defineArrayMember({
					name: 'timeline',
					type: 'timeline',
				}),
				defineField({
					type: 'image',
					icon: ImageIcon as any,
					name: 'image',
					title: 'Image',
					options: {
						hotspot: true,
					},
					preview: {
						select: {
							imageUrl: 'asset.url',
							title: 'caption',
						},
					},
					fields: [
						defineField({
							title: 'Caption',
							name: 'caption',
							type: 'string',
						}),
						defineField({
							name: 'alt',
							type: 'string',
							title: 'Alt text',
							...helpField(
								'Describe meaningful images for screen readers. The caption is not used automatically as alt text.',
								'images',
							),
						}),
					],
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
				subtitle: 'Page',
				title,
			}
		},
	},
})
