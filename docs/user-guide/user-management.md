# User Management Guide

User management is available to administrators at `/admin/users` and `/admin/roles`. You must be logged in with an account that has the relevant identity management permissions to access these pages.

## Users

### Viewing and Searching Users

Navigate to **Admin > Users** (`/admin/users`).

The page shows a paginated table with the following columns:

- **Username** — the user's login name.
- **Name** — first and last name.
- **Email** — email address.
- **Phone** — phone number (shown as `-` if not set).
- **Status** — Active or Inactive badge.
- **Created** — the date the account was created.

Use the **Search users** input at the top-right to filter the list by username or name. The total number of users is shown on the left.

### Creating a User

1. Click the **Add User** button (top-right of the Users page).
2. A dialog opens. Fill in the fields:
   - **Username** (required) — must be unique.
   - **Email** (required) — must be a valid email address.
   - **First Name** — optional.
   - **Last Name** — optional.
   - **Phone Number** — optional.
   - **Password** (required for new users) — choose a password.
   - **Confirm Password** (required for new users) — must match the password field.
   - **Active** toggle — controls whether the user can log in. Defaults to on.
   - **Lockout Enabled** toggle — controls whether the account can be locked after failed login attempts. Defaults to on.
3. Click **Create** to save the user.

### Editing a User

1. In the Users table, click the three-dot menu on the row for the user you want to edit.
2. Select **Edit**.
3. The same dialog opens, pre-filled with the current values. The password fields are hidden in edit mode.
4. You can update any field including the user's **Roles**. In edit mode a checklist of all assignable roles appears. Check or uncheck roles to add or remove them from the user. Roles marked **Default** are the system default roles.
5. Click **Update** to save.

### Assigning Roles to a User

Roles can be assigned from the Edit User dialog (see above). Check or uncheck roles in the **Roles** section and click **Update**.

### Managing User-Level Permissions

Individual permissions can be granted or denied on a per-user basis, in addition to whatever permissions come from their roles.

1. In the Users table, click the three-dot menu on the row for the user.
2. Select **Permissions**.
3. A large permissions dialog opens showing all available permissions grouped by category (for example: AbpIdentity, CmsKit, FeatureManagement, etc.).
4. Use the **Search permissions** box at the top to filter by name.
5. Each group has a group-level checkbox at the top. Checking the group selects all permissions in that group; unchecking it deselects them all. Individual permissions can also be toggled independently.
6. Click **Save Changes** to apply. Click **Cancel** to discard.

### Deleting a User

1. In the Users table, click the three-dot menu on the row for the user.
2. Select **Delete** (shown in red).
3. The user is deleted immediately. This action cannot be undone.

You can also select multiple users using the checkboxes in the first column (including a "select all" checkbox in the header) to perform bulk actions.

---

## Roles

Navigate to **Admin > Roles** (`/admin/roles`).

The roles table shows:

- **Name** — the role name.
- **Static** — whether the role is static (built-in) or dynamic. Static roles cannot be deleted.
- **Default** — whether the role is automatically assigned to new users.
- **Created** — creation date.

### Creating a Role

1. Click **Add Role** (top-right of the Roles page).
2. Fill in the fields:
   - **Role Name** (required).
   - **Default Role** toggle — if on, this role is automatically assigned to newly created users.
   - **Public Role** toggle — if on, the role is visible to the public.
   - **Static Role** toggle — if on, the role cannot be deleted after creation (this setting cannot be changed after saving).
3. Click **Create**.

### Editing a Role

1. In the Roles table, click the three-dot menu on the row.
2. Select **Edit**.
3. Update the Name, Default, or Public settings. The Static toggle is disabled in edit mode.
4. Click **Update**.

### Managing Role Permissions

Permissions define what users in a role are allowed to do across the application.

1. In the Roles table, click the three-dot menu on the row.
2. Select **Permissions**.
3. A large dialog opens showing all permissions grouped by category.
4. Use the **Search permissions** input to filter. Click the X button next to the search box to clear the filter.
5. Toggle individual permissions or use a group's top-level checkbox to grant/revoke all permissions in that group at once.
6. Click **Save Changes**.

Static roles cannot be deleted. The Delete option is disabled for them in the actions menu.

### Deleting a Role

1. In the Roles table, click the three-dot menu on the row.
2. Select **Delete** (shown in red). This option is disabled for static roles.

---

## Application-Level Permissions

In addition to role-based and user-based permissions, there is an **Admin > Permissions** page (`/admin/permissions`) where application-wide default permissions can be configured. This page works the same way as the per-role and per-user permission dialogs: permissions are listed by group, can be searched, toggled individually or by group, and saved with **Save Changes**. Use **Reset** to discard any unsaved changes.

---

## Dashboard Overview

The **Dashboard** (`/dashboard`) gives administrators a summary view of the platform:

- **Total Users** and **Active Users** count cards.
- **Total Roles** count card.
- **Total Tenants** count card.
- A pie chart showing Active vs. Locked users.
- A bar chart showing the count per role.
- A recent activity feed showing the five most recently created or updated user accounts.
- A team members list showing the five most recently created users.
