import { chromium, FullConfig } from "@playwright/test";

// Global setup runs once before all tests
async function globalSetup(config: FullConfig) {
	// Create a browser instance for setup tasks
	const browser = await chromium.launch();

	try {
		// Create a new page
		const page = await browser.newPage();

		// Navigate to the app
		await page.goto(config.webServer?.url || "http://localhost:3000");

		// Wait for the app to load
		await page.waitForLoadState("networkidle");

		// Perform any global setup tasks here
		// For example: seed test data, configure test environment, etc.

		// Set up test mode authentication
		console.log("Setting up test authentication...");

		// Set test mode which enables mock authentication
		await page.evaluate(() => {
			localStorage.setItem("test-mode", "true");
			sessionStorage.setItem("test-mode", "true");
		});

		// Reload the page to apply test mode
		await page.reload();
		await page.waitForLoadState("networkidle");

		// Verify setup was successful
		const isAuthenticated = await page.locator('[data-testid="user-menu"]').isVisible().catch(() => false);

		if (isAuthenticated) {
			console.log("✅ Global setup completed successfully");
		} else {
			console.log("⚠️  Global setup completed, but authentication may not be configured");
		}

	} catch (error) {
		console.error("❌ Global setup failed:", error);
		throw error;
	} finally {
		await browser.close();
	}
}

export default globalSetup;
