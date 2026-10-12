import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	testDir: './tests/e2e',
	testMatch: 'presentation.spec.ts',
	forbidOnly: Boolean(process.env.CI),
	fullyParallel: false,
	workers: 1,
	timeout: 45_000,
	reporter: 'list',
	use: {
		baseURL: 'http://127.0.0.1:3100',
		screenshot: 'only-on-failure',
		trace: 'retain-on-failure',
	},
	projects: [
		{ name: 'presentation-desktop', use: { ...devices['Desktop Chrome'] } },
		{ name: 'presentation-mobile', use: { ...devices['Pixel 5'] } },
	],
	webServer: {
		command:
			'npm run build && npm run start -- --hostname 127.0.0.1 --port 3100',
		wait: { stdout: /Ready in/ },
		timeout: 180_000,
		reuseExistingServer: false,
	},
})
