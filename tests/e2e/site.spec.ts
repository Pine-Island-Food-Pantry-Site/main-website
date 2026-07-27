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
})
