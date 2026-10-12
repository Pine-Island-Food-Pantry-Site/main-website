Studio saves edits as drafts. **Saving** keeps your work; **publishing** makes it available to website visitors. A saved draft does not update the public website by itself.

## Understand document status

- A new draft has no public version yet.
- A published document can also have newer draft changes. Readers see the published version until you publish again.
- Wait for the editor's saving/synchronisation indicator to settle before leaving the document. Connection problems can prevent changes from being saved.

## Preview your changes

1. Open **Presentation** from Studio's tool navigation, or use a document's available preview/location link.
2. Navigate the preview to the page or post you are editing. A new page or post needs a slug before its address can be resolved.
3. Select the **Drafts** perspective to review saved changes, or **Published** to compare with published content. Check text, images, links, and the layout.
4. Enable **Edit** and select an editable area to open its corresponding field. Return to the document and make corrections; saved changes appear in the connected preview.
5. Previewing does not publish the draft. Check the public website again after publishing.

The homepage preview uses the same layout as the public website. Its latest-update photo and summary come from the latest post in the selected perspective, ordered by **Publish Date**. Select these areas to edit that post's **Cover Image** or **Overview**. Most homepage headings and other fixed copy are maintained by the developer and have no editing controls. Posts also have preview locations for their individual page and the posts listing; the latest post has a homepage location too.

A preview opened from Presentation can stay connected in a separate window. Ordinary standalone browsing leaves draft mode automatically. To check the public result independently, use a fresh private window.

If preview does not load, check [troubleshooting](troubleshooting.md). Preview availability depends on the deployed site's configuration and your access.

## Publish the document

1. Review [Before you publish](checklist.md).
2. Resolve validation errors. **Post** requires Title, Slug, Overview, and Cover Image; **Page** requires Title, Slug, and Overview; **Home** requires Title and Description.
3. Check that referenced documents are available. If you created or edited a linked document too, it may need to be published separately.
4. Select **Publish**, or the update/publish action shown for the document. Read any confirmation prompt.
5. Open the public website in a fresh tab or private window outside preview. Check the individual address and all affected shared areas.

Website caches and sharing previews may take time to update. If refreshing still shows old content, follow [changes not appearing](troubleshooting.md#my-changes-are-not-on-the-website). There is no guaranteed refresh time documented for this deployment.

## Discard, unpublish, and delete

**Discard changes** removes the draft. For a previously published document, the public version remains. A never-published draft may be removed entirely.

**Unpublish** removes the public version and retains content as a draft. **Delete** removes the document. Both can break links and affect referencing documents. Review the action menu and confirmation carefully; see [manage posts](manage-posts.md#unpublish-or-delete).

## Dates and scheduling

**Post → Publish Date** is used for ordering. A future date does not schedule the post or hide it until that date. Publishing a future-dated post can put it first in the list immediately.

Native scheduled-draft or Content Releases controls may be offered by your Sanity account. Their availability and permissions depend on the project. Ask the project administrator to confirm that a scheduling workflow is enabled before relying on it. A scheduled operation should be checked separately from the post's ordering date; see [account features](collaboration.md#optional-account-features).
