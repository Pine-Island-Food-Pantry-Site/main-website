import { access, readdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { headingId } from '../sanity/plugins/help/heading-id.mjs'

const articleDirectory = new URL('../docs/cms-admin/', import.meta.url)
const outputFile = new URL(
	'../sanity/plugins/help/articles.generated.json',
	import.meta.url,
)

export async function compileGuide(directory = articleDirectory) {
	const manifest = JSON.parse(
		await readFile(new URL('manifest.json', directory), 'utf8'),
	)
	const ids = new Set()
	for (const entry of manifest) {
		if (!/^[a-z0-9-]+$/.test(entry.id) || ids.has(entry.id)) {
			throw new Error(`Invalid or duplicate article ID: ${entry.id}`)
		}
		ids.add(entry.id)
		for (const key of ['title', 'category', 'summary', 'updatedAt']) {
			if (typeof entry[key] !== 'string' || !entry[key].trim()) {
				throw new Error(`${entry.id}: missing ${key}`)
			}
		}
		if (
			!/^\d{4}-\d{2}-\d{2}$/.test(entry.updatedAt) ||
			!Number.isFinite(Date.parse(entry.updatedAt))
		) {
			throw new Error(`${entry.id}: invalid update date`)
		}
		if (
			!Array.isArray(entry.keywords) ||
			entry.keywords.some((word) => typeof word !== 'string')
		) {
			throw new Error(`${entry.id}: keywords must be strings`)
		}
		if (entry.action) {
			const { label, intent, params } = entry.action
			if (
				!label ||
				!['create', 'edit'].includes(intent) ||
				!['home', 'settings', 'page', 'post'].includes(params?.type) ||
				(intent === 'edit' && !params.id)
			) {
				throw new Error(`${entry.id}: invalid editor action`)
			}
		}
	}
	if (!ids.has('start')) throw new Error('The guide needs a start article')
	const files = await readdir(directory)
	for (const file of files.filter(
		(file) => file.endsWith('.md') && file !== 'README.md',
	)) {
		if (!ids.has(file.slice(0, -3)))
			throw new Error(`Article missing from manifest: ${file}`)
	}
	const articles = await Promise.all(
		manifest.map(async (entry) => {
			const markdown = (
				await readFile(new URL(`${entry.id}.md`, directory), 'utf8')
			).trim()
			if (!markdown) throw new Error(`${entry.id}: empty article`)
			const headings = [...markdown.matchAll(/^## (.+)$/gm)].map((match) => ({
				id: headingId(match[1]),
				title: match[1],
			}))
			if (new Set(headings.map(({ id }) => id)).size !== headings.length) {
				throw new Error(`${entry.id}: duplicate heading anchors`)
			}
			return {
				...entry,
				markdown,
				headings,
				searchText: [entry.title, entry.summary, ...entry.keywords, markdown]
					.join(' ')
					.toLowerCase(),
			}
		}),
	)
	const byId = new Map(articles.map((article) => [article.id, article]))
	for (const article of articles) {
		for (const [, image, label, href] of article.markdown.matchAll(
			/(!?)\[([^\]]*)\]\(([^\s)]+)\)/g,
		)) {
			if (image) {
				if (
					!label.trim() ||
					!/^\/studio-help\/[a-z0-9-]+\.(webp|png)$/.test(href)
				) {
					throw new Error(
						`${article.id}: invalid screenshot or missing alt text: ${href}`,
					)
				}
				await access(new URL(`../public${href}`, import.meta.url))
				continue
			}
			if (/^https:\/\//.test(href)) continue
			const match = /^(?:\.\/)?([a-z0-9-]+)\.md(?:#([a-z0-9-]+))?$/.exec(href)
			const target = match && byId.get(match[1])
			if (
				!target ||
				(match[2] && !target.headings.some(({ id }) => id === match[2]))
			) {
				throw new Error(`${article.id}: invalid guide link ${href}`)
			}
		}
	}
	return `${JSON.stringify(articles, null, '\t')}\n`
}

export async function generateGuide({ check = false } = {}) {
	const content = await compileGuide()
	let previous
	try {
		previous = await readFile(outputFile, 'utf8')
	} catch (error) {
		if (error.code !== 'ENOENT') throw error
	}
	if (content === previous) return
	if (check)
		throw new Error('CMS guide is out of date. Run npm run docs:generate.')
	await writeFile(outputFile, content)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	await generateGuide({ check: process.argv.includes('--check') })
	console.log('CMS guide articles and links verified.')
}
