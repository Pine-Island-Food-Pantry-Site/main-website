import { DocumentIcon } from '@sanity/icons/Document'
import { ImageIcon } from '@sanity/icons/Image'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { helpField } from '@/sanity/plugins/help/HelpField'

export default defineType({
	name: 'post',
	title: 'Post',
	type: 'document',
	icon: DocumentIcon as any,
	// Uncomment below to have edits publish automatically as you type
	// liveEdit: true,
	fields: [
		defineField({
			name: 'title',
			...helpField(
				'Title shown on the post and its listing. Use a clear name for your announcement.',
				'posts',
			),
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			...helpField(
				'Website address under /posts/. Generate it from the title; changing a published slug can break old links.',
				'posts',
			),
			type: 'slug',
			options: {
				source: 'title',
				maxLength: 96,
				isUnique: (value, context) => context.defaultIsUnique(value, context),
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'overview',
			...helpField(
				'Short summary used in the post listing, website search, and search metadata. The latest post also supplies the homepage summary.',
				'posts',
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
			name: 'coverImage',
			title: 'Cover Image',
			...helpField(
				'Required cover photo for the post, listing, and social-sharing preview. Check the crop and hotspot before publishing.',
				'images',
			),
			type: 'image',
			options: {
				hotspot: true,
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'duration',
			title: 'Publish Date',
			...helpField(
				'Controls post order and the latest homepage update. A future date does not delay publication.',
				'publishing',
			),
			type: 'duration',
		}),
		defineField({
			name: 'tags',
			title: 'Tags',
			...helpField(
				'Optional labels displayed on the post. The current website search matches titles and overviews, not tags.',
				'manage-posts',
			),
			type: 'array',
			of: [{ type: 'string' }],
			options: {
				layout: 'tags',
			},
		}),
		defineField({
			name: 'description',
			title: 'Post Description',
			...helpField(
				'Full story shown on the individual post page. Add text, links, photos, and timelines using the available controls.',
				'formatting',
			),
			type: 'array',
			of: [
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
							description:
								'Alternative text for screenreaders. Falls back on caption if not set',
						}),
					],
				}),
			],
		}),
	],
})
