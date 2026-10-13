# CMS admin help plan

Status: proposed plan, based on repository inspection on October 12, 2026.

Implementation note: the Help & Guide tool, 13 articles, contextual field links, screenshots, and maintenance commands are now implemented. The guide records current feature limitations. Live publishing/recovery exercises and admin acceptance should use a non-production dataset or an approved real update.

Audience: Pine Island Food Pantry staff and volunteers who maintain website content. Assume no knowledge of Sanity, Next.js, or development tools.

Confirmed maintenance decision: developers maintain the help articles in the project, alongside CMS changes.

## Delivery inside the CMS

Add a top-level **Help & Guide** tool to the existing Studio at `/studio`. Use Sanity's custom tool API and native Studio UI components so help feels like part of the editing environment. Give every article a stable URL, such as `/studio/help/posts`, for bookmarks and contextual links.

The tool should include:

- A start page with common tasks: create a post, edit an existing post, upload a photo, publish changes, and update the footer.
- A sidebar grouped by task, with a readable article area and an article table of contents for longer guides.
- Local search across article titles, summaries, keywords, and text. Include synonyms such as photo/image and announcement/post.
- Links to the corresponding content editor, using Studio intents instead of manually constructing editor URLs.
- Visible navigation on small screens, keyboard access, and support for Studio's light and dark themes.
- A last-reviewed date and a configured support contact on relevant articles.

Add brief descriptions and links to the relevant guide at confusing fields. Keep ordinary field instructions short; put full tutorials in the help tool.

Store articles as Markdown in `docs/cms-admin/`, with a small manifest containing IDs, titles, categories, summaries, keywords, and review dates. Use a build-time import or generation step to supply the Studio with article content and its search index. Select a Markdown renderer compatible with the existing Next.js/Studio build when implementing. Avoid runtime filesystem reads in the browser and keep documentation code out of public website routes.

Suggested implementation locations:

- `docs/cms-admin/`: the authoritative articles and captured screenshots.
- `sanity/plugins/help/`: tool registration, routing, rendering, and search.
- `sanity.config.ts`: register the help tool alongside existing tools.
- `sanity/schemas/`: contextual descriptions and article links where useful.
- `README.md`: brief explanation of how developers update and review the guide.

Sanity reference: https://www.sanity.io/docs/studio/custom-studio-tool

## Current feature map

| Area | Current behavior | Documentation implication |
| --- | --- | --- |
| Studio tools | Content editing, Presentation, and Vision are configured. | Explain content editing and preview. Identify Vision as a technical query tool with no role in routine updates. |
| Posts | Title, slug, overview, cover image, publish date, tags, and rich content. Title, slug, overview, and cover image are required. | Make creating and updating posts the primary tutorial. Explain each field and its website effect. |
| Post listing | `/posts` lists posts ordered by `duration.publishedAt`, six per page. Search matches title and overview. | Recommend setting a date. Explain that tags and full body text are not searched by the current public search. |
| Latest homepage update | The public homepage uses the latest post's cover image and overview. | Explain how updating/publishing posts changes this section. |
| Pages | Title, slug, overview, and body; available at `/<slug>`. Title, slug, and overview are required. | Explain custom pages and linking to them. Reserve existing application routes such as `about`, `contact`, `posts`, and `studio`. Creating a Page does not replace the hardcoded About or Contact pages. |
| Home | Title and description feed default site metadata. A post-reference list is exposed in Studio. | Describe metadata effects accurately; resolve the unused reference-list behavior before documenting it as a working selection feature. |
| Settings | Footer text and default social-sharing image are consumed by the site. Menu references are exposed in Studio. | Document the footer and sharing image. Resolve or clearly label the menu field because navigation currently uses hardcoded links. |
| Rich text | Page Body, Post Description, and Footer Info support formatted blocks and links. Page/post content supports images and timelines. | Describe controls actually available in each field; do not promise a generic page builder or arbitrary formatting. |
| Images | Cover and sharing images have crop/hotspot options. Body images also have caption and alt-text fields. | Explain upload, reuse, replacement, focal point, captions, and descriptive alt text. Distinguish which image fields have extra text fields. |
| Timelines | A timeline block contains at most two timeline groups, each with milestones. | Explain group/item structure, ordering, milestone fields, and the two-group limit after checking date rendering. |
| Fixed website content | Most homepage copy, About content, Contact details/form, logo, donation URL, and main navigation are defined in code. | Include a clear “What can I change?” map and explain when to contact the developer. |

## Documentation outline

| Article | Coverage |
| --- | --- |
| Start here | Open `/studio`, sign in, find content, understand Studio navigation, and complete a first update. |
| What can I change? | Map website sections to CMS documents, including content that requires a developer. Define document, field, draft, publish, reference, and slug in plain language. |
| Create a post | Fill required fields, generate the URL slug, write an overview, add a cover photo, set a date, add tags and body content, preview, publish, and verify the public result. |
| Edit and manage posts | Find existing posts, update published content, understand ordering and homepage selection, duplicate where available, and handle unpublishing/deletion and references. |
| Create and edit pages | Page fields, URL examples, existing route conflicts, body content, and how readers reach a new page. |
| Home and site settings | Default site title/description, footer, social-sharing image, and the actual status of the post-selection and menu fields. |
| Write and format content | Paragraphs, available formatting, lists where available, links, paste behavior, and inserting/reordering/removing blocks. |
| Work with photos | Upload or reuse an asset, replace a photo, crop and hotspot, write captions/alt text where supported, and understand where images appear. |
| Build a timeline | Add a timeline block, create one or two groups, add milestones, fill fields, reorder, and preview. |
| Drafts, preview, and publishing | Autosaved drafts versus the public version, validation messages, Presentation, publish/update, discard changes, unpublish, and verifying the public site. |
| Collaboration and recovery | Concurrent editing, reviewing changes, available document history, restoring a revision, and who manages user access. Verify available controls and history retention against the project's plan. |
| Troubleshooting and support | Cannot sign in, missing permissions, Publish disabled, image cropped badly, broken links, page not found, changes not appearing, and preview differing from the public website. |
| Before you publish | A short reusable checklist for spelling, links, photos, required fields, preview, and public verification. |

For each task article, use the same format:

1. Explain what the task changes on the website.
2. State where to begin in Studio and any prerequisites.
3. Give numbered steps using the exact visible field and button names.
4. Provide a realistic pantry example, such as a food-drive announcement.
5. Explain how to confirm the result.
6. List common problems and link to related guides.

Use annotated screenshots of this project's Studio for steps that benefit from a visual. Capture them after relevant behavior and labels are settled. Avoid showing personal account details. Keep UI text instructional and move implementation details into developer maintenance notes.

Native editor guidance: https://www.sanity.io/docs/user-guides/content-operations-cheatsheet

## Behavior to resolve before final instructions

These are findings from code inspection, not verified production behavior. Decide whether to fix each item or document its current limitation. Broader changes to make fixed website content editable should be scoped separately.

1. **Home post selection is disconnected.** The schema exposes `Posts`, the home query requests `showcaseProjects`, the home component expects `posts`, and the public homepage selects its latest post separately. Establish the intended behavior before describing a selection workflow.
2. **Menu settings do not control navigation.** The navbar renders fixed links and ignores `menuItems`. Connect the field, or label/hide it so admins do not expect an edit to affect the site.
3. **Homepage preview alignment (resolved in #45).** Draft and public views now share the landing-page renderer and latest-post query, with live cover-image/overview editing and accurate document locations. The publishing guide explains perspectives and fixed content.
4. **Timeline date fields and rendering disagree.** The schema stores `duration.publishedAt`, while the milestone renderer reads `duration.start` and `duration.end`. Resolve the intended date format before writing this tutorial.
5. **Overview validation counts blocks.** `max(155)` is applied to an array, so it does not enforce a 155-character description. A short description can be editorial advice; do not describe this as an enforced character limit unless validation changes.
6. **Body-image alt fallback differs from the field description.** The schema promises fallback to caption, but the renderer passes only `alt`. Correct the behavior or description before documenting the fallback.
7. **A publish-date field is not a scheduler.** The current post queries sort by that date without excluding future dates. Explain that setting a future date does not delay publication. Document native scheduling only if the account and Studio expose it and the workflow has been verified.
8. **Publishing freshness needs deployment verification.** A revalidation endpoint exists, but its presence does not prove a webhook is configured. Verify updates on the homepage, post list, individual posts/pages, and footer before giving admins a time expectation.
9. **Account capabilities need verification.** Confirm available history, collaboration, scheduling, and access-management controls with the actual admin role and subscription before promising them. Distinguish Studio editing from project administration.

## Implementation sequence

1. **Confirm the feature map:** walk through the real Studio with an admin account, compare preview and public behavior, and decide how to handle the mismatches above. Record support details and available account features.
2. **Write the complete article set:** prioritize the first-post tutorial, publishing, photos, settings, and troubleshooting for editorial review, then cover pages, timelines, collaboration, and every remaining exposed field/control.
3. **Build the help tool:** article routing, navigation, search, editor links, and responsive native Studio styling. Integrate the reviewed repository content.
4. **Add contextual help:** update field descriptions and relevant guide links. Capture screenshots against the final interface.
5. **Validate the guide:** run type checking, linting, and a production build for code changes. Verify authenticated article navigation, search, direct links, keyboard access, and themes. Walk through every documented editing workflow in a non-production dataset or safe preview environment; do not publish test content to production.
6. **Admin acceptance:** have a representative admin create and preview a post, update an existing post, change footer text, and find help for a validation error using only the guide. Correct any steps where they get stuck.

## Completion criteria and maintenance

- Help is reachable from Studio navigation, and individual articles can be bookmarked.
- Search finds common tasks and reports when no result matches.
- Every exposed CMS field and routine editor action is explained or clearly identified as unavailable/technical.
- Instructions match the deployed Studio's labels and observed website behavior.
- Admins can complete common tasks without developer assistance and can identify changes that require a developer.
- Documentation has one authoritative repository source and a named maintenance owner.
- Future changes to schemas, rendering, preview, or editor actions include a documentation review. Review screenshots and plan-dependent features during Studio upgrades.
