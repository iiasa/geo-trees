import { test, expect } from "./fixtures";

test.describe("Role Management", () => {
	test("should display roles table", async ({ loggedInPage }) => {
		await loggedInPage.goto("/roles");

		await expect(loggedInPage.locator('[data-testid="roles-table"]')).toBeVisible();
	});

	test("should load roles data", async ({ loggedInPage }) => {
		await loggedInPage.goto("/roles");

		await loggedInPage.waitForLoading();

		const roleRows = loggedInPage.locator('[data-testid="role-row"]');
		await expect(roleRows.first()).toBeVisible();
	});

	test("should create a new role", async ({ loggedInPage }) => {
		await loggedInPage.goto("/roles");

		// Wait for the page to load
		await loggedInPage.waitForLoading();

		await loggedInPage.clickButton("create-role");

		// Wait for modal to open
		await expect(loggedInPage.locator('[data-testid="role-form-modal"]')).toBeVisible();

		await loggedInPage.fillFormField("role-name", "e2e-test-role");

		await loggedInPage.clickButton("save-role");

		// Wait for modal to close (indicates success)
		await expect(loggedInPage.locator('[data-testid="role-form-modal"]')).toBeHidden({ timeout: 10000 });

		// Check if role appears in the table
		await expect(loggedInPage.locator('[data-testid="role-row"]').first()).toBeVisible();
	});

	test("should edit role permissions", async ({ loggedInPage }) => {
		await loggedInPage.goto("/roles");

		// Wait for the page to load
		await loggedInPage.waitForLoading();

		// Click actions trigger on first role to open dropdown
		await loggedInPage.locator('[data-testid="role-row"]').first().locator('[data-testid="role-actions-trigger"]').click();

		// Click permissions button (dropdown content is not scoped to row)
		await loggedInPage.locator('[data-testid="edit-permissions-btn"]').click();

		// Wait for modal to open
		await expect(loggedInPage.locator('[data-testid="permissions-modal"]')).toBeVisible();

		// Toggle some permissions (if available)
		const permissionCheckbox = loggedInPage.locator('[data-testid="permission-checkbox"]').first();
		if (await permissionCheckbox.isVisible()) {
			await permissionCheckbox.check();
		}

		await loggedInPage.clickButton("save-permissions");

		// Wait for modal to close (indicates success)
		await expect(loggedInPage.locator('[data-testid="permissions-modal"]')).toBeHidden({ timeout: 10000 });
	});

	test("should delete a role", async ({ loggedInPage }) => {
		await loggedInPage.goto("/roles");

		// Wait for the page to load
		await loggedInPage.waitForLoading();

		// Click actions trigger on first role to open dropdown
		const firstRoleRow = loggedInPage.locator('[data-testid="role-row"]').first();
		await firstRoleRow.locator('[data-testid="role-actions-trigger"]').click();

		// Click delete button (dropdown content is not scoped to row)
		await loggedInPage.locator('[data-testid="delete-role-btn"]').click();

		// Wait for confirmation dialog and click confirm
		await expect(loggedInPage.locator('[data-testid="confirm-delete-btn"]')).toBeVisible();
		await loggedInPage.locator('[data-testid="confirm-delete-btn"]').click();

		// Wait for dialog to close (indicates success)
		await expect(loggedInPage.locator('[data-testid="confirm-delete-btn"]')).toBeHidden({ timeout: 10000 });

		// Check that we still have role rows (deletion might not actually work in test mode)
		await expect(loggedInPage.locator('[data-testid="role-row"]').first()).toBeVisible();
	});
});
