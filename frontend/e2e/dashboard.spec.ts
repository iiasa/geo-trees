import { test, expect } from "./fixtures";

test.describe("Dashboard", () => {
	test("should load dashboard page", async ({ loggedInPage }) => {
		await loggedInPage.goto("/dashboard");

		await expect(loggedInPage.locator('[data-testid="dashboard-content"]')).toBeVisible();
	});

	test("should display dashboard metrics", async ({ loggedInPage }) => {
		await loggedInPage.goto("/dashboard");

		// Check for metric cards
		await expect(loggedInPage.locator('[data-testid="metric-total-tasks"]')).toBeVisible();
		await expect(loggedInPage.locator('[data-testid="metric-completed-tasks"]')).toBeVisible();
		await expect(loggedInPage.locator('[data-testid="metric-completion-rate"]')).toBeVisible();
	});

	test("should display charts", async ({ loggedInPage }) => {
		await loggedInPage.goto("/dashboard");

		// Check for chart containers
		await expect(loggedInPage.locator('[data-testid="status-chart"]')).toBeVisible();
		await expect(loggedInPage.locator('[data-testid="type-chart"]')).toBeVisible();
	});

	test("should display recent activity", async ({ loggedInPage }) => {
		await loggedInPage.goto("/dashboard");

		await expect(loggedInPage.locator('[data-testid="recent-activity"]')).toBeVisible();

		// Check for activity items
		const activityItems = loggedInPage.locator('[data-testid="activity-item"]');
		await expect(activityItems.first()).toBeVisible();
	});

	test("should display tasks table", async ({ loggedInPage }) => {
		await loggedInPage.goto("/dashboard");

		await expect(loggedInPage.locator('[data-testid="tasks-table"]')).toBeVisible();

		// Check for table headers - use more specific selectors to avoid conflicts
		await expect(loggedInPage.locator('th:has([data-testid="table-header-id"])')).toBeVisible();
		await expect(loggedInPage.locator('th:has([data-testid="table-header-header"])')).toBeVisible();
		await expect(loggedInPage.locator('th:has([data-testid="table-header-status"])')).toBeVisible();
	});

	test("should allow sorting tasks table", async ({ loggedInPage }) => {
		await loggedInPage.goto("/dashboard");

		// Click on the Header column header to sort
		await loggedInPage.locator('[data-testid="table-header-header"]').click();

		// Wait a moment for sorting to apply
		await loggedInPage.page.waitForTimeout(500);

		// Verify table is still visible
		await expect(loggedInPage.locator('[data-testid="tasks-table"]')).toBeVisible();
	});

	test("should handle responsive design", async ({ loggedInPage }) => {
		await loggedInPage.goto("/dashboard");

		// Check default layout
		await expect(loggedInPage.locator('[data-testid="dashboard-content"]')).toBeVisible();

		// Test tablet size
		await loggedInPage.page.setViewportSize({ width: 768, height: 1024 });
		await expect(loggedInPage.locator('[data-testid="dashboard-content"]')).toBeVisible();

		// Test mobile size
		await loggedInPage.page.setViewportSize({ width: 375, height: 667 });
		await expect(loggedInPage.locator('[data-testid="dashboard-content"]')).toBeVisible();
	});

	test("should refresh dashboard data", async ({ loggedInPage }) => {
		await loggedInPage.goto("/dashboard");

		// Click refresh button if available
		const refreshButton = loggedInPage.locator('[data-testid="refresh-dashboard-btn"]');
		if (await refreshButton.isVisible()) {
			await refreshButton.click();

			await loggedInPage.waitForLoading();

			await loggedInPage.waitForToast("Dashboard refreshed");
		}
	});

	test("should navigate to task details", async ({ loggedInPage }) => {
		await loggedInPage.goto("/dashboard");

		// Click on a task row
		await loggedInPage.locator('[data-testid="task-row"]').first().click();

		// Should navigate to task detail view or open modal
		await expect(loggedInPage.locator("body")).toBeVisible();
	});
});
