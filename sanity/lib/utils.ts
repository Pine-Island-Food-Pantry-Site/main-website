import { createImageUrlBuilder } from '@sanity/image-url'
import type { Image } from 'sanity'

import { dataset, projectId } from '@/sanity/lib/api'

export { resolveHref } from './resolveHref.mjs'

const imageBuilder = createImageUrlBuilder({
	projectId: projectId || '',
	dataset: dataset || '',
})

export const urlForImage = (source: Image | undefined) => {
	// Ensure that source image contains a valid reference
	if (!source?.asset?._ref) {
		return undefined
	}

	return imageBuilder?.image(source).auto('format').fit('max')
}

export function urlForOpenGraphImage(image: Image | undefined) {
	return urlForImage(image)?.width(1200).height(627).fit('crop').url()
}
