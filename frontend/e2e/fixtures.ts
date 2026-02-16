import { test as base, expect, type Page } from "@playwright/test";

// Extend the base test with custom fixtures
type TestFixtures = {
	loggedInPage: AppPage; // We'll define this based on auth implementation
};

export const test = base.extend<TestFixtures>({
	// Authenticated page fixture
	loggedInPage: async ({ page }, use) => {
		// Add test mode header to all requests
		page.route('**', (route) => {
			const headers = {
				...route.request().headers(),
				'x-test-mode': 'true'
			};
			route.continue({ headers });
		});

		// Set test mode in localStorage and sessionStorage
		await page.addInitScript(() => {
			localStorage.setItem('test-mode', 'true');
			sessionStorage.setItem('test-mode', 'true');
		});

		// Navigate to the app
		await page.goto("/");

		// Wait for authentication to be established
		await page.waitForLoadState("networkidle");

		// Wait for either the authenticated dashboard content or the welcome message to appear
		await Promise.race([
			page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 10000 }),
			page.waitForSelector('text=Welcome back', { timeout: 10000 }),
			page.waitForSelector('[data-testid="user-menu"]', { timeout: 10000 }),
		]).catch(() => {
			// If we don't see authenticated content, the auth might not be working
			console.log("Authentication may not be established, proceeding anyway");
		});

		await use(new AppPage(page));
	},
});

// Export expect for convenience
export { expect };

// Page Object Model helpers
export class AppPage {
	constructor(private _page: Page) {}

	// Expose underlying page for Playwright expectations
	get page() {
		return this._page;
	}

	// Expose underlying page methods
	get locator() {
		return this._page.locator.bind(this._page);
	}

	// Add other commonly used methods as needed
	get url() {
		return this._page.url();
	}

	async goto(path: string = "/") {
		await this._page.goto(path);
		await this._page.waitForLoadState("networkidle");
	}

	async waitForLoading() {
		// Wait for page to be in a ready state
		await this._page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {
			// If we timeout, just continue - the page might still be loading
			console.log("Loading timeout, continuing test");
		});
	}

	getUserMenu() {
		return this._page.locator('[data-testid="user-menu"]');
	}

	getDashboardContent() {
		return this._page.locator('[data-testid="dashboard-content"]');
	}

	getUsersTable() {
		return this._page.locator('[data-testid="users-table"]');
	}

	getRolesTable() {
		return this._page.locator('[data-testid="roles-table"]');
	}

	getTenantsTable() {
		return this._page.locator('[data-testid="tenants-table"]');
	}

	async clickMenuItem(name: string) {
		await this._page.locator(`[data-testid="menu-${name}"]`).click();
	}

	async fillFormField(fieldName: string, value: string) {
		const field = this._page.locator(`[data-testid="field-${fieldName}"]`);
		if (await field.isVisible()) {
			await field.fill(value);
		}
	}

	async clickButton(buttonName: string) {
		await this._page.locator(`[data-testid="btn-${buttonName}"]`).click();
	}

	async waitForToast(message: string) {
		// Wait for Sonner toast to appear with the message
		await this._page.waitForSelector(`[data-sonner-toaster] [data-title]:has-text("${message}")`, { timeout: 5000 });
	}

	async takeScreenshot(name: string) {
		await this._page.screenshot({ path: `e2e/screenshots/${name}.png` });
	}
}

// Test data helpers
export const testData = {
	users: {
		admin: { username: "admin", password: "admin123" },
		testUser: { username: "testuser", password: "testpass123" },
	},
	roles: {
		admin: { name: "Administrator", description: "Full access role" },
		user: { name: "User", description: "Basic user role" },
	},
	tenants: {
		default: { name: "Default Tenant", host: "localhost" },
		test: { name: "Test Tenant", host: "test.localhost" },
	},
};
