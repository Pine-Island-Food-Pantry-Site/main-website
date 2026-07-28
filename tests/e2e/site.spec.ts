import { expect, test } from '@playwright/test'

test.describe('Pine Island Food Pantry', () => {
	test('homepage loads its core content', async ({ page }) => {
		const response = await page.goto('/')

		expect(response?.ok()).toBe(true)
		await expect(
			page.getByRole('heading', {
				level: 1,
				name: 'Welcome to The Pine Island Food Pantry',
			}),
		).toBeVisible()
		await expect(
			page.getByRole('img', { name: 'Pine Island Food Pantry Logo' }),
		).toBeVisible()
		await expect(
			page.getByRole('heading', { level: 3, name: 'Our Mission' }),
		).toBeVisible()
	})

	test('primary navigation reaches the contact page', async ({ page }) => {
		await page.goto('/')
		await page.getByRole('link', { name: 'Contact', exact: true }).click()

		await expect(page).toHaveURL(/\/contact$/)
		await expect(
			page.getByRole('heading', {
				level: 1,
				name: 'The Pine Island Food Pantry',
			}),
		).toBeVisible()
		await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible()
	})

	test('donation link points to the secure donation flow', async ({ page }) => {
		await page.goto('/')

		const donateLink = page.getByRole('link', { name: 'Donate', exact: true })
		await expect(donateLink).toHaveAttribute(
			'href',
			'https://www.paypal.com/donate?hosted_button_id=45JBRR8VRXJ76',
		)
		await expect(donateLink).toHaveAttribute('target', '_blank')
	})

	test('contact form validates required fields without submitting', async ({
		page,
	}) => {
		await page.goto('/contact')
		await page.getByRole('button', { name: 'Submit' }).click()

		await expect(page.getByText('Full name is required')).toBeVisible()
		await expect(page.getByText('Enter your email')).toBeVisible()
		await expect(page.getByText('Enter your phone number')).toBeVisible()
		await expect(page.getByText('Enter your Message')).toBeVisible()
	})

	test('navigation adapts to desktop and mobile viewports', async ({
		page,
	}, testInfo) => {
		await page.goto('/')

		const navigation = page
			.getByRole('link', { name: 'Donate', exact: true })
			.locator('..')
		const isMobile = testInfo.project.name === 'mobile-chromium'

		await expect(navigation).toHaveCSS(
			'position',
			isMobile ? 'fixed' : 'relative',
		)
		await expect(
			page.getByRole('link', { name: 'Contact', exact: true }),
		).toBeVisible()
	})

	test('theme preference can be changed and persists across pages', async ({
		page,
	}) => {
		const consoleErrors: string[] = []
		page.on('console', (message) => {
			if (message.type() === 'error') {
				consoleErrors.push(message.text())
			}
		})
		page.on('pageerror', (error) => consoleErrors.push(error.message))

		await page.goto('/')

		const themeSwitcher = page.getByRole('combobox', { name: 'Color theme' })
		await expect(themeSwitcher).toHaveValue('auto')

		await themeSwitcher.selectOption('dark')
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
		await expect
			.poll(() => page.evaluate(() => localStorage.getItem('theme-preference')))
			.toBe('dark')

		await page.goto('/about')
		await expect(
			page.getByRole('combobox', { name: 'Color theme' }),
		).toHaveValue('dark')
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

		for (const route of ['/contact', '/posts']) {
			await page.goto(route)
			await expect(
				page.getByRole('combobox', { name: 'Color theme' }),
			).toHaveValue('dark')
			await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
		}

		await themeSwitcher.selectOption('light')
		await page.reload()
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
		expect(consoleErrors).toEqual([])
	})

	test('automatic theme follows the system color preference', async ({
		page,
	}) => {
		await page.emulateMedia({ colorScheme: 'dark' })
		await page.goto('/')

		await expect(
			page.getByRole('combobox', { name: 'Color theme' }),
		).toHaveValue('auto')
		await expect(page.locator('html')).toHaveCSS(
			'background-color',
			'rgb(13, 21, 36)',
		)

		await page.emulateMedia({ colorScheme: 'light' })
		await expect(page.locator('html')).toHaveCSS(
			'background-color',
			'rgb(255, 253, 245)',
		)
	})
})
