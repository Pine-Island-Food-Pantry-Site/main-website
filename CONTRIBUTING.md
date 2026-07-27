# Contributing

## Local setup

Install dependencies and copy the example environment file:

```bash
npm install
cp .env.local.example .env.local
```

Add the required Sanity project ID and dataset to `.env.local`, then start the
development server with `npm run dev`.

## UI tests

The end-to-end suite uses Playwright and covers the homepage, primary
navigation, donation destination, contact-form validation, and desktop/mobile
layouts.

Install Chromium once after installing the project dependencies:

```bash
npx playwright install chromium
```

Run the full suite:

```bash
npm run test:e2e
```

Playwright starts the Next.js development server automatically. If a server is
already running on port 3000, the local test run reuses it. To run and debug
tests interactively:

```bash
npm run test:e2e:ui
```

Failed runs write traces, screenshots, and videos to `test-results/`. The HTML
report is written to `playwright-report/` and can be opened with:

```bash
npx playwright show-report
```

GitHub Actions runs the suite for pushes to `main` and pull requests. The
repository requires approval for workflow runs from all external contributors,
so only organization members and owners run PR workflows automatically.
Repository variables named `NEXT_PUBLIC_SANITY_PROJECT_ID` and
`NEXT_PUBLIC_SANITY_DATASET` provide the public Sanity connection settings in
CI. The read-only `SANITY_API_READ_TOKEN` repository secret allows the test
server to query Sanity content.
