# CMS Guide

The Content Management System (CMS) lets administrators create and publish web pages, manage site navigation menus, and moderate user comments. All CMS admin pages are under `/admin/cms/` and require authentication with CMS permissions.

The CMS is built on ABP Framework's CMS Kit module. Pages are authored using **Puck**, a drag-and-drop visual page builder.

## CMS Sections

| Section | URL | Description |
|---------|-----|-------------|
| Pages | `/admin/cms/pages` | List, create, edit, and delete content pages |
| Navigation | `/admin/cms/navigation` | Manage the site navigation menu hierarchy |
| Comments | `/admin/cms/comments` | Review and moderate user-submitted comments |

Published pages are publicly accessible at `/page/{slug}`.

---

## Pages

### Viewing the Pages List

Navigate to **Admin > CMS > Pages** (`/admin/cms/pages`).

The table shows:

- **Title** — the page title.
- **Slug** — the URL path where the page is published (shown as `/page/{slug}`).
- **Created** — creation date.
- **Last Modified** — date of last edit.

### Creating a Page

1. Click **Create Page** (top-right).
2. You are taken to the page creation form.
3. Fill in the fields:
   - **Title** (required, minimum 3 characters) — the display title of the page.
   - **Slug** (required) — the URL-friendly identifier. It is auto-generated from the title as you type. Only lowercase letters, numbers, and hyphens are allowed (for example, `my-page-title`). The slug is validated in real time — if it already exists you will see an error and must choose a different one.
4. Use the **Puck visual editor** below the form fields to build the page content (see [Using the Puck Editor](#using-the-puck-editor) below).
5. Click **Save** to publish the page. Click **Cancel** to return to the list without saving.

### Editing a Page

1. In the Pages table, click the three-dot menu on the row for the page.
2. Select **Edit**. You are taken to the page edit form, pre-filled with the current title, slug, and content.
3. Make your changes.
4. Click **Save**.

### Viewing a Published Page

1. In the Pages table, click the three-dot menu on the row.
2. Select **View**. The published page opens in a new browser tab at its public URL (`/page/{slug}`).

### Setting a Page as the Homepage

One page can be designated as the site homepage.

1. In the Pages table, click the three-dot menu on the row.
2. Select **Set as Homepage**.

### Deleting a Page

1. In the Pages table, click the three-dot menu on the row.
2. Select **Delete** (shown in red).

You can also select multiple pages using the checkboxes in the first column and perform bulk delete.

---

## Using the Puck Visual Editor

The Puck editor is a drag-and-drop page builder that loads when you create or edit a page. It has three areas:

- **Left sidebar** — a palette of available content blocks that you can add to the page.
- **Centre canvas** — a live preview of the page. Drag blocks from the sidebar onto the canvas to add them.
- **Right sidebar** — properties panel. When a block is selected on the canvas, its configurable fields appear here.

### Available Content Blocks

There are 24 built-in content blocks:

| Block | Purpose |
|-------|---------|
| Heading | H1–H6 headings with configurable level |
| Text | Plain text paragraph |
| Button | Clickable button with variants |
| Image | Image with alt text |
| Card | Card with title and description |
| List | Ordered or unordered list |
| Quote | Blockquote with optional author attribution |
| Video | Video embed with autoplay controls |
| Divider | Horizontal divider line |
| Container | Layout container with configurable padding |
| Grid | Multi-column grid layout |
| Form | Interactive contact/input form |
| Hero | Full-width hero section with optional gradient and animation |
| Testimonial | Testimonial card |
| Carousel | Image carousel/slider |
| Table | Data table |
| Gallery | Image gallery |
| Spacer | Vertical spacing element |
| Welcome | Welcome/introduction section |
| Accordion | Collapsible accordion with multiple expandable sections |
| Alert | Contextual alert/notification banner with severity variants |
| Tabs | Tabbed content panels for organising related information |
| CTA | Call-to-action section with headline, body text, and button |
| Stats | Display a set of key statistics or metrics with labels |

### Adding a Block

1. Find the block you want in the left sidebar.
2. Drag it onto the canvas at the position where you want it to appear.
3. Click the block on the canvas to select it. Its settings appear in the right sidebar.
4. Edit the settings (text, URLs, variant options, etc.) and the canvas updates in real time.

### Moving and Removing Blocks

- Drag a block to a new position within the canvas to reorder it.
- Select a block and use the delete/remove control in the editor toolbar to remove it.

### Saving

Content is saved when you click the **Save** button in the page form above the editor. The editor and the form work together — the content you build in the editor is serialised and stored with the page.

---

## Navigation (Menu Items)

Navigate to **Admin > CMS > Navigation** (`/admin/cms/navigation`).

The navigation page manages the hierarchical site menu. It shows both a tree view (menu structure) and a flat table (all menu items). A public navigation preview section is also available.

### Adding a Root Menu Item

1. Click **Add menu item** to create a top-level item.
2. Fill in the form fields:
   - **Display name** (required) — the label shown in the navigation.
   - **URL** — the link destination (e.g. `https://example.com` or `/path`). Leave empty if linking to a CMS page.
   - **Page** — optionally select a CMS page; this automatically fills in the URL.
   - **Icon** — optional Tabler icon name (e.g. `IconHome`).
   - **Target** — `_self` (same tab) or `_blank` (new tab).
   - **Required permission** — optionally restrict who can see this menu item by permission name.
   - **Active** toggle — whether the item is visible.
   - **Order** — lower numbers appear first at the same level.
3. Click **Save**.

### Adding a Child Menu Item

1. Find the parent item in the tree view or table.
2. Click **Add child** on that item.
3. Fill in the same form fields as above. The parent is set automatically.
4. Click **Save**.

### Editing a Menu Item

1. Find the item in the tree or table.
2. Click **Edit**.
3. Update the fields and click **Save**.

### Moving a Menu Item

To change a menu item's position within the hierarchy:

1. Find the item in the tree or table.
2. Click **Move**.
3. A dialog opens. Choose the **New parent** (or leave as root) and the **Position** (0 = top within that parent).
4. Click **Apply**.

### Deleting a Menu Item

1. Find the item in the tree or table.
2. Click **Delete**.
3. Confirm the deletion in the confirmation dialog.

Deleting a parent item also removes its children.

---

## Comments

Navigate to **Admin > CMS > Comments** (`/admin/cms/comments`).

The comments moderation page lists all user-submitted comments across CMS pages. A badge at the top shows how many comments are waiting for review.

### Filtering Comments

Use the **Filter by status** dropdown (top-right of the comments section) to show:

- **All** — every comment regardless of status.
- **Approved** — approved comments.
- **Pending** — comments awaiting review.
- **Rejected** — rejected comments.

### Approving a Comment

Click the **Approve** button on a comment card. The comment's status is updated immediately.

### Rejecting a Comment

Click the **Reject** button on a comment card. The comment is marked as rejected and will not be shown publicly.

### Deleting a Comment

Click the **Delete** button (red) on a comment card. A confirmation dialog appears. Click **Delete** to permanently remove the comment.

### Pagination

If there are more than 20 comments, use the **Previous** and **Next** buttons at the bottom to page through the list.

---

## Permissions

CMS actions are protected by the following permissions. If you cannot see a button or perform an action, your account may not have the required permission — contact an administrator.

| Permission | Controls |
|------------|---------|
| `CmsKit.Pages.Create` | Create Page button |
| `CmsKit.Pages.Update` | Edit button on a page |
| `CmsKit.Pages.Delete` | Delete button and bulk delete |
| `CmsKit.Pages.SetAsHomePage` | Set as Homepage option |
| `CmsKit.MenuItems.Create` | Add menu item / Add child buttons |
| `CmsKit.MenuItems.Update` | Edit and Move buttons on menu items |
| `CmsKit.MenuItems.Delete` | Delete button on menu items |
