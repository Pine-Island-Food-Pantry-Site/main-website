import assert from 'node:assert/strict'
import { test } from 'node:test'
import { evaluate, parse } from 'groq-js'

import { latestPostIdQuery, latestPostQuery } from '../sanity/lib/queries.ts'
import { documentLocations } from '../sanity/plugins/presentation/documentLocations.ts'

test('Home and Settings have a homepage location without menu references', () => {
	for (const type of ['home', 'settings']) {
		assert.deepEqual(documentLocations(type).locations, [
			{ title: 'Homepage', href: '/' },
		])
	}
	assert.match(documentLocations('home').message, /metadata/)
})

test('custom pages have their own address without a misleading menu warning', () => {
	const result = documentLocations('page', {
		_id: 'page-one',
		title: 'Food drive',
		slug: { current: 'food-drive' },
	})
	assert.deepEqual(result.locations, [
		{ title: 'Food drive', href: '/food-drive' },
	])
	assert.equal(result.tone, undefined)
	assert.equal(result.message, undefined)
})

test('reserved and missing page slugs do not point editors at unrelated content', () => {
	for (const slug of ['about', 'contact', 'posts', 'studio', 'api']) {
		assert.equal(
			documentLocations('page', { _id: 'page', slug: { current: slug } })
				.locations,
			undefined,
		)
	}
	assert.equal(documentLocations('page', { _id: 'page' }).tone, 'caution')
})

test('only the latest post gets a homepage location; all posts get the listing', () => {
	const post = {
		_id: 'post-one',
		title: 'Food drive',
		slug: { current: 'food-drive' },
	}
	assert.deepEqual(
		documentLocations('post', post, post._id).locations.map(({ href }) => href),
		['/posts/food-drive', '/posts', '/'],
	)
	assert.deepEqual(
		documentLocations('post', post, 'different-post').locations.map(
			({ href }) => href,
		),
		['/posts/food-drive', '/posts'],
	)
	assert.equal(documentLocations('milestone'), null)
})

test('homepage and location queries agree on date-based selection, including an empty dataset', async () => {
	const dataset = [
		{
			_id: 'older',
			_type: 'post',
			title: 'Older',
			_updatedAt: '2030-01-01',
			duration: { publishedAt: '2025-01-01T00:00:00Z' },
		},
		{
			_id: 'newest',
			_type: 'post',
			title: 'Newest',
			duration: { publishedAt: '2026-10-01T00:00:00Z' },
		},
		{
			_id: 'page',
			_type: 'page',
			duration: { publishedAt: '2031-01-01T00:00:00Z' },
		},
	]
	const post = await (await evaluate(parse(latestPostQuery), { dataset })).get()
	const id = await (await evaluate(parse(latestPostIdQuery), { dataset })).get()
	assert.equal(post._id, 'newest')
	assert.equal(id, post._id)
	assert.equal(
		await (await evaluate(parse(latestPostQuery), { dataset: [] })).get(),
		null,
	)
})
