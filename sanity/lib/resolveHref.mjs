/**
 * @param {string} [documentType]
 * @param {string} [slug]
 * @returns {string | undefined}
 */
export function resolveHref(documentType, slug) {
	switch (documentType) {
		case 'home':
			return '/'
		case 'page':
			return slug ? `/${slug}` : undefined
		case 'post':
			return slug ? `/posts/${slug}` : undefined
		default:
			return undefined
	}
}
