import { CogIcon } from '@sanity/icons/Cog'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { helpField } from '@/sanity/plugins/help/HelpField'

export default defineType({
	name: 'settings',
	title: 'Settings',
	type: 'document',
	icon: CogIcon as any,
	// Uncomment below to have edits publish automatically as you type
	// liveEdit: true,
	fields: [
		defineField({
			name: 'menuItems',
			title: 'Menu Item list',
			...helpField(
				'Currently unused by the website navigation. Contact the maintainer to change the main menu.',
				'settings',
			),
			type: 'array',
			of: [
				{
					title: 'Reference',
					type: 'reference',
					to: [
						{
							type: 'home',
						},
						{
							type: 'page',
						},
						{
							type: 'post',
						},
					],
				},
			],
		}),
		defineField({
			name: 'footer',
			...helpField(
				'Text displayed at the bottom of website pages. Publish this document to update the shared footer.',
				'settings',
			),
			title: 'Footer Info',
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
				}),
			],
		}),
		defineField({
			name: 'ogImage',
			title: 'Open Graph Image',
			type: 'image',
			...helpField(
				'Default preview image for sharing website links. Individual posts use their cover image. This does not change the logo.',
				'images',
			),
			options: {
				hotspot: true,
			},
		}),
	],
	preview: {
		prepare() {
			return {
				title: 'Menu Items',
			}
		},
	},
})
