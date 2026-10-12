import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { pathToFileURL } from 'node:url'

import {
	findGuideArticles,
	guideLink,
} from '../sanity/plugins/help/content-utils.ts'
import { compileGuide } from '../scripts/generate-cms-help.mjs'

test('the shipped guide matches its sources and has valid links and anchors', async () => {
	const compiled = await compileGuide()
	assert.equal(
		compiled,
		await readFile(
			new URL(
				'../sanity/plugins/help/articles.generated.json',
				import.meta.url,
			),
			'utf8',
		),
	)
})

test('search finds task synonyms, ignores case, and checks the full article text', async () => {
	const articles = JSON.parse(await compileGuide())
	assert.equal(findGuideArticles(articles, 'PHOTO')[0].id, 'images')
	assert.equal(findGuideArticles(articles, 'announcement')[0].id, 'posts')
	assert.ok(
		findGuideArticles(articles, 'identical dates').some(
			({ id }) => id === 'manage-posts',
		),
	)
	assert.deepEqual(findGuideArticles(articles, '   '), articles)
	assert.deepEqual(findGuideArticles(articles, 'no-such-task-94823'), [])
})

test('article links preserve cross-article anchors and reject unrelated URLs', () => {
	assert.deepEqual(guideLink('publishing.md#preview-your-changes'), {
		id: 'publishing',
		fragment: 'preview-your-changes',
	})
	assert.equal(guideLink('https://example.org/posts.md'), null)
	assert.equal(guideLink('../posts.md'), null)
})

test('the compiler rejects broken article and section links', async () => {
	const directory = await mkdtemp(join(tmpdir(), 'cms-guide-'))
	try {
		const url = pathToFileURL(`${directory}/`)
		await writeFile(
			new URL('manifest.json', url),
			JSON.stringify([
				{
					id: 'start',
					title: 'Start',
					category: 'Basics',
					summary: 'Start editing',
					keywords: [],
					updatedAt: '2026-10-12',
				},
			]),
		)
		await writeFile(
			new URL('start.md', url),
			'## Getting started\n\n[Missing article](missing.md)',
		)
		await assert.rejects(compileGuide(url), /invalid guide link missing.md/)
		await writeFile(
			new URL('start.md', url),
			'## Getting started\n\n[Missing section](start.md#missing)',
		)
		await assert.rejects(
			compileGuide(url),
			/invalid guide link start.md#missing/,
		)
	} finally {
		await rm(directory, { recursive: true, force: true })
	}
})
