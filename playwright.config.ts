import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI
		? [['line'], ['html', { open: 'never' }]]
		: [['list'], ['html', { open: 'on-failure' }]],
	use: {
		baseURL: 'http://127.0.0.1:3000',
		screenshot: 'only-on-failure',
		trace: 'on-first-retry',
		video: 'on-first-retry',
	},
	projects: [
		{
			name: 'desktop-chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'mobile-chromium',
			use: { ...devices['Pixel 5'] },
		},
	],
	webServer: {
		command: 'npm run dev -- --hostname 127.0.0.1',
		url: 'http://127.0.0.1:3000',
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
	},
})
