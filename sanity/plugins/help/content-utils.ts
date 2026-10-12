export interface GuideHeading {
	id: string
	title: string
}

export interface GuideAction {
	label: string
	intent: 'create' | 'edit'
	params: { type: string; id?: string }
}

export interface GuideArticle {
	id: string
	title: string
	category: string
	summary: string
	keywords: string[]
	updatedAt: string
	action?: GuideAction
	markdown: string
	headings: GuideHeading[]
	searchText: string
}

export { headingId } from './heading-id.mjs'

export function findGuideArticles(articles: GuideArticle[], query: string) {
	const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
	if (terms.length === 0) return articles
	return articles
		.map((article) => {
			if (!terms.every((term) => article.searchText.includes(term))) return null
			const title = article.title.toLowerCase()
			const keywords = article.keywords.join(' ').toLowerCase()
			const score = terms.reduce(
				(total, term) =>
					total + (title.includes(term) ? 3 : keywords.includes(term) ? 2 : 1),
				0,
			)
			return { article, score }
		})
		.filter((match) => match !== null)
		.sort((a, b) => b.score - a.score)
		.map(({ article }) => article)
}

export function guideLink(href: string) {
	const match = /^(?:\.\/)?([a-z0-9-]+)\.md(?:#([a-z0-9-]+))?$/.exec(href)
	return match ? { id: match[1], fragment: match[2] } : null
}
