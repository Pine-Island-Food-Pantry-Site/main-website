import type { PortableTextBlock } from '@portabletext/types'
import type { Image } from 'sanity'

export interface MenuItem {
	_type: string
	slug?: string
	title?: string
}

export interface MilestoneItem {
	description?: string
	duration?: {
		start?: string
		end?: string
	}
	image?: Image
	tags?: string[]
	title?: string
}

export interface Posts {
	_type: string
	coverImage?: Image
	overview?: PortableTextBlock[]
	_id?: string
	slug?:
		| string
		| {
				current?: string
		  }
	tags?: string[]
	title?: string
}

// Page payloads

export interface HomePagePayload {
	footer?: PortableTextBlock[]
	overview?: PortableTextBlock[]
	posts?: Posts[]
	title?: string
}

export interface PagePayload {
	coverImage: Image
	description: PortableTextBlock[]
	body: PortableTextBlock[]
	name?: string
	overview?: PortableTextBlock[]
	title?: string
	slug?: string
}

export interface PostPayload {
	coverImage?: Image
	description?: PortableTextBlock[]
	duration?: string
	overview?: PortableTextBlock[]
	slug: string
	tags?: string[]
	title?: string
}

export interface LandingPagePayload {
	coverImage?: Image
	overview?: PortableTextBlock[]
	slug?: string
}

export interface SettingsPayload {
	footer?: PortableTextBlock[]
	menuItems?: MenuItem[]
	ogImage?: Image
}
