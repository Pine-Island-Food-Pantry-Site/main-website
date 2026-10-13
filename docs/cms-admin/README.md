# Maintaining the Studio guide

The audience is pantry staff and volunteers. Developers maintain these files; admins read them in **Help & Guide** at `/studio/help`.

## Edit an article

1. Edit the corresponding Markdown file in this directory.
2. Update its title, summary, category, search keywords, and `updatedAt` in `manifest.json` when needed. The date means the guide text was updated, not that a production workflow was verified.
3. Run `npm run docs:generate`. This produces `sanity/plugins/help/articles.generated.json` with article text, headings, and search data. Commit this generated file with the source changes.
4. Run `npm run docs:check` and `npm run test:docs`.
5. Open the relevant article in Studio and verify its instructions, links, and formatting.

Generation also runs before `npm run dev` and `npm run build`. If you edit an article while the dev server is running, run `npm run docs:generate` again; hot reload will pick up the generated file. Content is bundled locally and lazy-loaded with the help tool. No browser filesystem access, external help service, or CMS documentation dataset is used.

## Add an article or editor shortcut

Use a stable, lowercase, hyphenated ID. Add `<id>.md` and a manifest entry with the same ID. The article appears in its category automatically. Keep `start` as the guide's landing article.

Article titles come from the manifest, so do not repeat an H1 in the Markdown. Use plain-text `##` headings for the article's table of contents; headings must be unique within an article. Use standard Markdown paragraphs, numbered steps, bullets, emphasis, and links. Tables and raw HTML are not enabled.

Screenshots live in `public/studio-help/` so the browser can display them without a filesystem loader. Use `![descriptive alt text](/studio-help/example.webp)` and add an explanatory caption in the article. The compiler checks that images exist and have alt text. Capture only the relevant editing area, excluding account details and private content: screenshot files are served publicly. Refresh screenshots when labels or controls change. The initial screenshots were captured from the authenticated local Studio without editing or publishing content.

Link to another guide with `[label](posts.md)` or to a section with `[label](publishing.md#preview-your-changes)`. Heading anchors are lowercase, remove punctuation, and replace spaces with hyphens. The generator checks article and section links and fails on broken references. External links must use `https://` and open in a new tab.

An optional manifest `action` uses a Sanity `create` or `edit` intent and parameters. Use `type: post` or `type: page` for creation; use `type: settings, id: settings` or `type: home, id: home` to open shared documents. A create shortcut opens an editor; it does not publish content.

Schema fields can spread `...helpField(text, articleId)` from `sanity/plugins/help/HelpField.tsx`. It keeps the schema description as a string and adds a guide link below the default field through the supported field-component API. Its custom `help` intent opens the corresponding article without hardcoding an editor URL. Verify the target ID when adding a field-help link. If a field already has custom components, preserve those explicitly rather than overwriting them with this helper.

## Support contact

Set `NEXT_PUBLIC_CMS_SUPPORT_EMAIL` to the maintainer's approved contact address in the deployment environment and rebuild. This address is shown to admins in the guide. When unset or empty, the guide directs admins to the person who maintains their website or gave them access; it does not invent a support contact.

## Keep instructions accurate

Review the relevant articles whenever schemas, frontend rendering, routes, preview, or Studio actions change. Use the actual deployed Studio labels. Check which subscription/role features are available before promising history retention, scheduling, comments, tasks, or releases.

The guide describes current behavior, including unused Home post/menu lists and timeline date-display limitations. Remove those notes and update the corresponding field descriptions when a fix is shipped. Presentation uses the same homepage and post-listing renderers as the public website, with live CMS field targets. Migrating fixed website content into the CMS is separate work.

Run `npm run test:presentation` when changing preview behavior. It builds and starts the website on port 3100, then checks desktop/mobile previews using an in-memory Presentation controller. It requires the usual local Sanity read configuration and Playwright Chromium (`npx playwright install chromium`). The fixture supplies draft updates and field source maps without saving or publishing content to the dataset. These checks also run in the UI Tests workflow.

The generator keeps its own deterministic JSON formatting; Biome's formatter is disabled only for that generated file. Validation of the sources and generated output remains available through the documentation commands.

Before releasing, walk through article navigation, search, direct URLs, editor shortcuts, field-help links, keyboard use, light/dark themes, and small-screen layout. Content-publishing and recovery checks belong in a non-production dataset or an approved real update. Do not publish sample announcements into the production dataset.
