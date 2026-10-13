import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { type BrowserContext, expect, type Page, test } from '@playwright/test'
import { build } from 'esbuild'

let controllerScript: string
let previewModeId: string

test.beforeAll(async () => {
	const bundle = await build({
		entryPoints: ['tests/e2e/fixtures/presentation-controller.ts'],
		bundle: true,
		write: false,
		format: 'iife',
		platform: 'browser',
		target: 'es2022',
	})
	controllerScript = bundle.outputFiles[0].text
	const manifest = JSON.parse(
		await readFile(resolve('.next/prerender-manifest.json'), 'utf8'),
	)
	previewModeId = manifest.preview.previewModeId
})

async function enableLocalPreview(
	context: BrowserContext,
	baseURL: string | undefined,
) {
	if (!baseURL) throw new Error('Presentation tests need a local baseURL')
	// Seed only the local test server's build-specific cookie. No CMS writes or auth bypass are added to the app.
	await context.addCookies([
		{
			name: '__prerender_bypass',
			value: previewModeId,
			url: baseURL,
			httpOnly: true,
			sameSite: 'Lax',
		},
	])
}

async function mountPreview(page: Page, path: string) {
	await page.route('**/__presentation-fixture?*', (route) =>
		route.fulfill({
			contentType: 'text/html',
			body: '<!doctype html><html lang="en"><head><title>Presentation test controller</title><style>body{margin:0}iframe{border:0;width:100%;height:100vh}</style></head><body><iframe id="preview" title="Website preview"></iframe></body></html>',
		}),
	)
	await page.goto(`/__presentation-fixture?path=${encodeURIComponent(path)}`)
	await page.addScriptTag({ content: controllerScript })
}

async function openPreview(page: Page, path: string) {
	await mountPreview(page, path)
	await expect
		.poll(() => page.evaluate(() => window.presentationFixture.connected))
		.toBe(true)
	return page.frameLocator('#preview')
}

test('the preview fixture rejects script schemes and arbitrary URLs', async ({
	page,
}) => {
	const errors: string[] = []
	page.on('pageerror', (error) => errors.push(error.message))
	for (const path of [
		'javascript:alert(1)',
		'https://example.com/',
		'//example.com/',
		'/api/draft',
	]) {
		await mountPreview(page, path)
		await expect(page.locator('#preview')).not.toHaveAttribute('src')
	}
	expect(errors).toHaveLength(4)
	for (const error of errors)
		expect(error).toBe('The preview fixture only supports known local routes')
})

test('public requests ignore a perspective cookie without authorised draft mode', async ({
	page,
	context,
	baseURL,
}) => {
	await context.addCookies([
		{
			name: 'sanity-preview-perspective',
			value: 'drafts',
			url: baseURL || 'http://127.0.0.1:3100',
		},
	])
	await page.goto('/')
	await expect(
		page.getByRole('heading', { name: 'Our Mission', exact: true }),
	).toBeVisible()
	await expect(page.locator('sanity-visual-editing')).toHaveCount(0)
	await expect(page.locator('main [data-sanity]')).toHaveCount(0)
})

test('homepage preview uses the public layout and updates the latest photo and overview live', async ({
	page,
	context,
	baseURL,
}) => {
	await enableLocalPreview(context, baseURL)
	const frame = await openPreview(page, '/')
	await expect(
		frame.getByRole('heading', { name: 'Our Mission', exact: true }),
	).toBeVisible()
	await expect(
		frame.getByRole('heading', {
			name: 'Volunteer Opportunities',
			exact: true,
		}),
	).toBeVisible()
	await expect(
		frame.getByText('Draft fixture overview 1', { exact: false }),
	).toBeVisible()
	const image = frame.locator('[data-sanity*="path=coverImage"] img')
	const originalImage = await image.getAttribute('src')
	if (!originalImage) throw new Error('The preview cover image did not render')
	await page.evaluate(() => window.presentationFixture.update())
	await expect(
		frame.getByText('Draft fixture overview 2', { exact: false }),
	).toBeVisible()
	await expect(image).not.toHaveAttribute('src', originalImage)
	await expect(frame.locator('[data-sanity*="path=overview"]')).toHaveAttribute(
		'data-sanity',
		/id=fixture-post-45;type=post;path=overview/,
	)
	await expect(frame.locator('main h1[data-sanity]')).toHaveCount(0)
	await image.click()
	await expect
		.poll(() => page.evaluate(() => window.presentationFixture.focus))
		.toMatchObject({ id: 'fixture-post-45', path: 'coverImage' })
	await page.evaluate(() =>
		window.presentationFixture.setPerspective('published'),
	)
	await expect(
		frame.getByText('Published fixture overview 2', { exact: false }),
	).toBeVisible()
	await expect(
		frame.getByText('Draft fixture overview 2', { exact: false }),
	).toHaveCount(0)
	await expect
		.poll(
			async () =>
				(await context.cookies()).find(
					(cookie) => cookie.name === 'sanity-preview-perspective',
				)?.value,
		)
		.toBe('published')
	await page.evaluate(() => window.presentationFixture.setPerspective('drafts'))
	await expect(
		frame.getByText('Draft fixture overview 2', { exact: false }),
	).toBeVisible()
	await page.evaluate(() => window.presentationFixture.clearLatest())
	await expect(
		frame.getByRole('heading', { name: 'Our Mission', exact: true }),
	).toBeVisible()
	await expect(frame.locator('[data-sanity*="path=coverImage"]')).toHaveCount(0)
})

test('post listing preview updates and keeps search and edit targets working', async ({
	page,
	context,
	baseURL,
}) => {
	await enableLocalPreview(context, baseURL)
	const frame = await openPreview(page, '/posts?search=fixture')
	await expect(
		frame.getByText('Fixture pantry announcement', { exact: false }),
	).toBeVisible()
	await expect(
		frame.getByText('Draft fixture overview 1', { exact: false }),
	).toBeVisible()
	await page.evaluate(() => window.presentationFixture.update())
	await expect(
		frame.getByText('Draft fixture overview 2', { exact: false }),
	).toBeVisible()
	await expect(
		frame.locator('[data-sanity*="path=coverImage"]'),
	).toHaveAttribute(
		'data-sanity',
		/id=fixture-post-45;type=post;path=coverImage/,
	)
	await expect(frame.getByRole('link', { name: 'Read More' })).toHaveAttribute(
		'href',
		'/posts/fixture-pantry-announcement',
	)
})

test('custom page and post previews load their content at the correct addresses', async ({
	page,
	context,
	baseURL,
}) => {
	await enableLocalPreview(context, baseURL)
	let frame = await openPreview(page, '/fixture-custom-page')
	await expect(
		frame.getByText('Fixture custom page', { exact: false }),
	).toBeVisible()
	await expect(
		frame.getByText('Fixture page body', { exact: false }),
	).toBeVisible()
	await expect(frame.locator('[data-sanity*="path=body"]')).toHaveAttribute(
		'data-sanity',
		/id=fixture-page-45;type=page;path=body/,
	)
	frame = await openPreview(page, '/posts/fixture-pantry-announcement')
	await expect(
		frame.getByText('Fixture pantry announcement', { exact: false }),
	).toBeVisible()
	await expect(
		frame.getByText('Fixture post body', { exact: false }),
	).toBeVisible()
	await expect(
		frame.locator('[data-sanity*="path=description"]'),
	).toHaveAttribute(
		'data-sanity',
		/id=fixture-post-45;type=post;path=description/,
	)
})

test('standalone browsing exits preview and clears the local draft cookie', async ({
	page,
	context,
	baseURL,
}) => {
	await enableLocalPreview(context, baseURL)
	await page.goto('/')
	await expect
		.poll(async () =>
			(await context.cookies()).some(
				(cookie) => cookie.name === '__prerender_bypass',
			),
		)
		.toBe(false)
	await expect(
		page.getByRole('heading', { name: 'Our Mission', exact: true }),
	).toBeVisible()
	await expect(page.locator('sanity-visual-editing')).toHaveCount(0)
})

test('draft mode cannot be enabled without a valid Studio preview secret', async ({
	request,
}) => {
	const response = await request.get('/api/draft', { maxRedirects: 0 })
	expect(response.status()).toBe(401)
	expect(response.headers()['set-cookie'] || '').not.toContain(
		'__prerender_bypass',
	)
})
