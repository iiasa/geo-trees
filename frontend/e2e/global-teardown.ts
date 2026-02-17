import { chromium, FullConfig } from "@playwright/test";

// Global teardown runs once after all tests
async function globalTeardown(_config: FullConfig) {
	// Create a browser instance for cleanup tasks
	const browser = await chromium.launch();

	try {
		// Perform any global cleanup tasks here
		// For example: clean up test data, reset database state, etc.

		console.log("🧹 Running global teardown...");

		// Example cleanup tasks (adapt to your needs):
		// - Clean up test users created during tests
		// - Reset test data to initial state
		// - Clear test-specific configurations

		// If you have an API endpoint for cleanup, you could call it here
		// const page = await browser.newPage();
		// await page.goto(`${config.webServer?.url || "http://localhost:3000"}/api/test/cleanup`);
		// await page.waitForLoadState("networkidle");

		console.log("✅ Global teardown completed successfully");

	} catch (error) {
		console.error("❌ Global teardown failed:", error);
		// Don't throw here to avoid masking test failures
	} finally {
		await browser.close();
	}
}

export default globalTeardown;
