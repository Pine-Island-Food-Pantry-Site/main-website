Start with the symptom below. If the issue continues, contact your website maintainer with the details listed at the end of this article.

## I cannot sign in or edit

Open your website's `/studio` address and sign in with the account invited to the Sanity project. If you have multiple accounts, check which one is active. For an access-denied message or missing editing/publishing controls, ask the project administrator to check your invitation and role.

## Publish is disabled

Check the editor's validation messages and open each affected field. A post needs **Title**, **Slug**, **Overview**, and **Cover Image**. A page needs **Title**, **Slug**, and **Overview**. Home needs **Title** and **Description**. Timeline milestones require **Title** and **Duration**, and each timeline block allows at most two groups.

Wait for an image upload or document save to finish. Check for a connection warning. If all errors are resolved and publishing is still unavailable, confirm your role with the project administrator.

## My changes are not on the website

1. Confirm that you published the intended document, rather than only saving or previewing it.
2. Confirm the field affects the section you are checking. Home's post list and Settings' menu list currently do not control the public listings or navigation.
3. Open the correct public address outside draft preview, then refresh or use a private window.
4. Check whether any linked documents also need publishing.
5. If published content stays old, ask the maintainer to check the website's content refresh. Include the affected addresses and the time you published.

Search engines and social networks can retain older descriptions and images even after the website itself updates. Check the website first.

## A page or post is not found

Check that the document is published and has the expected slug. Posts use `/posts/<slug>`; Pages use `/<slug>`. A slug change gives a new address and can leave old links broken. Check that a Page does not conflict with an existing route such as `about`, `contact`, `posts`, `studio`, or `api`.

If an intended navigation link is missing, remember that a Page is not automatically added to the menu. Ask the developer for navigation changes.

## An image is missing or cropped badly

Wait for the upload, then verify that the field contains the selected image. Reopen its crop/hotspot controls and keep the important subject inside the crop. Check the listing, full post, and latest-update card, since they use different frames. Read [Work with photos](images.md).

The website logo is separate from uploaded post images. Replacing a cover image does not replace the logo.

## Preview is different or will not open

The homepage preview currently uses a different layout from the public homepage. Use the public homepage to check its final layout after publishing. Previewing does not publish drafts.

For a missing page/post preview, generate its slug and wait for saving. Check that you are signed in and that the correct address is selected in Presentation. If preview reports an access/configuration problem or stays blank, send the error to the maintainer rather than changing unrelated content.

## Posts or timeline dates look wrong

Posts are ordered by **Publish Date**, not the time you last edited them. Set intentional dates and avoid relying on the ordering of missing or identical dates. A future date does not delay publication.

Timeline date labels have a known display limitation. See [Build a timeline](timelines.md#current-date-limitation) and ask the maintainer to fix it if accurate displayed years are needed.

## Ask for help

Use the support contact shown below this guide if one is configured. Otherwise, contact the person who maintains the website or gave you Studio access.

Include the document title, website address, what you tried, what you expected, the exact error message, and roughly when it happened. A screenshot can help explain a layout or error. Do not include passwords or account tokens.

For editing questions, Sanity also provides [editor user guides](https://www.sanity.io/docs/user-guides/content-operations-cheatsheet). Your maintainer handles behavior specific to this website.
