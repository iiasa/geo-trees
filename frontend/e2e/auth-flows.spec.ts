import { test, expect } from "@playwright/test";

// Run all auth tests serially to avoid DB concurrency errors
// when multiple tests hit ABP's login page simultaneously
test.describe.configure({ mode: "serial" });

/**
 * E2E tests for authentication flows.
 *
 * Prerequisites:
 * - Backend running (dotnet run)
 * - Frontend running (pnpm dev)
 * - Mailpit running (docker compose up -d from backend/)
 * - Database seeded (dotnet run -- --migrate-database)
 *
 * Mailpit API: http://localhost:8025/api/v1/messages
 * Mailpit UI:  http://localhost:8025
 */

const MAILPIT_API = process.env.MAILPIT_API || "http://localhost:8025/api/v1";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1q2w3E*";

// --- Helpers ---

async function clearMailpit() {
	await fetch(`${MAILPIT_API}/messages`, { method: "DELETE" });
}

async function getMailpitMessages(retries = 10, delayMs = 1000) {
	for (let i = 0; i < retries; i++) {
		const res = await fetch(`${MAILPIT_API}/messages`);
		const data = await res.json();
		if (data.messages && data.messages.length > 0) {
			return data.messages;
		}
		await new Promise((r) => setTimeout(r, delayMs));
	}
	return [];
}

async function findEmailByTo(toAddress: string, retries = 10) {
	const messages = await getMailpitMessages(retries);
	return messages.find((m: { To: { Address: string }[] }) =>
		m.To.some((t: { Address: string }) => t.Address === toAddress),
	);
}

function generateTestUser() {
	const id = Date.now().toString(36);
	return {
		username: `testuser_${id}`,
		email: `testuser_${id}@test.local`,
		password: "TestPass1",
	};
}

// --- Login via OIDC (ABP backend login page) ---

async function loginViaOidc(
	page: import("@playwright/test").Page,
	username: string,
	password: string,
) {
	// Click the "Sign In to Get Started" button on the landing page
	await page.goto("/");
	await page.waitForLoadState("networkidle");
	await page.getByRole("button", { name: /sign in/i }).click();

	// Wait for redirect to ABP's login page
	await page.waitForURL(/\/Account\/Login/i, { timeout: 15000 });

	// Fill ABP's server-rendered login form
	await page.locator("#LoginInput_UserNameOrEmailAddress").fill(username);
	await page.locator("#LoginInput_Password").fill(password);
	await page.getByRole("button", { name: /^login$/i }).click();

	// Wait for redirect back to the frontend
	await page.waitForURL(/localhost:3000/, { timeout: 15000 });
}

// --- Tests ---

test.describe("Signup Flow", () => {
	test.beforeEach(async () => {
		await clearMailpit();
	});

	test("should register a new user and receive welcome email", async ({
		page,
	}) => {
		const user = generateTestUser();

		// Navigate to registration page
		await page.goto("/auth/register");
		await page.waitForLoadState("networkidle");

		// Ensure hydration by interacting with a field
		const usernameField = page.getByLabel(/username/i);
		await usernameField.click();

		// Fill registration form
		await usernameField.fill(user.username);
		await page.getByLabel(/email address/i).fill(user.email);
		await page
			.getByLabel(/^password/i, { exact: false })
			.first()
			.fill(user.password);
		await page.getByLabel(/confirm password/i).fill(user.password);
		await page.getByLabel(/institution/i).fill("Test Institute");
		await page.getByLabel(/country/i).fill("Austria");

		// Accept terms
		await page.getByRole("checkbox").click();

		// Submit
		await page.getByRole("button", { name: /create account/i }).click();

		// Should see email verification success screen
		await expect(
			page.getByText(/account created.*verify your email/i),
		).toBeVisible({ timeout: 10000 });
		await expect(page.getByText(user.email)).toBeVisible();

		// Check Mailpit for welcome email
		const welcomeEmail = await findEmailByTo(user.email);
		expect(welcomeEmail).toBeTruthy();
		expect(welcomeEmail.Subject).toContain("Welcome");
	});

	test("should show validation errors for empty form", async ({ page }) => {
		await page.goto("/auth/register");
		await page.waitForLoadState("networkidle");

		// Type and clear a field to ensure React hydration is complete
		const usernameField = page.getByLabel(/username/i);
		await usernameField.click();
		await usernameField.fill("x");
		await usernameField.clear();

		await page.getByRole("button", { name: /create account/i }).click();

		await expect(page.getByText(/username is required/i)).toBeVisible();
		await expect(page.getByText(/email is required/i)).toBeVisible();
		await expect(page.getByText(/password is required/i)).toBeVisible();
	});

	test("should navigate to registration from landing page", async ({
		page,
	}) => {
		await page.goto("/");

		await page.getByRole("link", { name: /create one/i }).click();

		await expect(page).toHaveURL(/\/auth\/register/);
		await expect(page.getByText(/create account/i).first()).toBeVisible();
	});
});

test.describe("Login Flow", () => {
	test("should login with admin credentials via OIDC", async ({ page }) => {
		await loginViaOidc(page, ADMIN_USERNAME, ADMIN_PASSWORD);

		// Should see authenticated content (redirects to dashboard)
		await expect(page.getByText(/welcome,?\s*admin/i)).toBeVisible({
			timeout: 10000,
		});
	});

	test("should show error for invalid credentials", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("button", { name: /sign in/i }).click();

		await page.waitForURL(/\/Account\/Login/i, { timeout: 15000 });

		await page
			.locator("#LoginInput_UserNameOrEmailAddress")
			.fill("admin");
		await page.locator("#LoginInput_Password").fill("wrongpassword");
		await page.getByRole("button", { name: /^login$/i }).click();

		// Should stay on login page with an error
		await expect(page).toHaveURL(/\/Account\/Login/i);
		await expect(
			page.getByText(/invalid|incorrect|unable/i).first(),
		).toBeVisible({ timeout: 5000 });
	});

	test("should redirect to forgot password from login page", async ({
		page,
	}) => {
		await page.goto("/auth/forgot-password");

		await expect(page.getByText(/forgot password/i).first()).toBeVisible();
		await expect(page.getByLabel(/email/i)).toBeVisible();
	});
});

test.describe("Forgot Password Flow", () => {
	test.beforeEach(async () => {
		await clearMailpit();
	});

	test("should send password reset email", async ({ page }) => {
		await page.goto("/auth/forgot-password");
		await page.waitForLoadState("networkidle");

		await page.getByLabel(/email/i).click();
		await page.getByLabel(/email/i).fill("admin@abp.io");
		await page.getByRole("button", { name: /send reset code/i }).click();

		// Should see success screen
		await expect(page.getByText(/check your email/i).first()).toBeVisible({
			timeout: 10000,
		});

		// Check Mailpit for the reset email
		const resetEmail = await findEmailByTo("admin@abp.io");
		expect(resetEmail).toBeTruthy();
	});

	test("should show error for non-existent email", async ({ page }) => {
		await page.goto("/auth/forgot-password");
		await page.waitForLoadState("networkidle");

		await page.getByLabel(/email/i).click();
		await page.getByLabel(/email/i).fill("nonexistent@test.local");
		await page.getByRole("button", { name: /send reset code/i }).click();

		// ABP returns an error for non-existent emails
		await expect(
			page.locator("[data-sonner-toaster]").getByText(/failed|error|not find/i),
		).toBeVisible({ timeout: 10000 });
	});

	test("should show validation error for empty email", async ({ page }) => {
		await page.goto("/auth/forgot-password");
		await page.waitForLoadState("networkidle");

		// Ensure hydration by interacting with the field first
		const emailField = page.getByLabel(/email/i);
		await emailField.click();
		await emailField.fill("x");
		await emailField.clear();

		await page.getByRole("button", { name: /send reset code/i }).click();

		await expect(page.getByText(/email is required/i)).toBeVisible();
	});
});

test.describe("Change Password Flow", () => {
	test.beforeEach(async () => {
		await clearMailpit();
	});

	test("should change password for logged-in user", async ({ page }) => {
		// Login first
		await loginViaOidc(page, ADMIN_USERNAME, ADMIN_PASSWORD);

		// Navigate to security settings
		await page.goto("/profile/security");
		await page.waitForLoadState("networkidle");

		await expect(page.getByText(/change password/i).first()).toBeVisible({
			timeout: 10000,
		});

		// Ensure hydration by interacting with a field
		const currentPwField = page.getByLabel(/current password/i);
		await currentPwField.click();

		// Fill change password form
		await currentPwField.fill(ADMIN_PASSWORD);
		const newPassword = "NewPass1!";
		await page.getByLabel(/^new password/i).fill(newPassword);
		await page.getByLabel(/confirm new password/i).fill(newPassword);

		// Submit
		await page
			.getByRole("button", { name: /change password/i })
			.click();

		// Should see success toast
		await expect(
			page.locator("[data-sonner-toaster]").getByText(/password changed/i),
		).toBeVisible({ timeout: 10000 });

		// Check Mailpit for password changed notification
		const notification = await findEmailByTo("admin@abp.io");
		expect(notification).toBeTruthy();
		expect(notification.Subject).toContain("Password");

		// Wait for toast to auto-dismiss before reverting password
		await page.locator("[data-sonner-toaster]").waitFor({ state: "hidden", timeout: 15000 }).catch(() => {});

		// Revert password back to original so other tests still work
		await page
			.getByLabel(/current password/i)
			.fill(newPassword);
		await page.getByLabel(/^new password/i).fill(ADMIN_PASSWORD);
		await page
			.getByLabel(/confirm new password/i)
			.fill(ADMIN_PASSWORD);
		await page
			.getByRole("button", { name: /change password/i })
			.click({ force: true });

		await expect(
			page.locator("[data-sonner-toaster]").getByText(/password changed/i),
		).toBeVisible({ timeout: 10000 });
	});

	test("should show validation errors for empty change password form", async ({
		page,
	}) => {
		await loginViaOidc(page, ADMIN_USERNAME, ADMIN_PASSWORD);
		await page.goto("/profile/security");
		await page.waitForLoadState("networkidle");

		await expect(page.getByText(/change password/i).first()).toBeVisible({
			timeout: 10000,
		});

		// Ensure hydration by interacting with a field first
		const currentPwField = page.getByLabel(/current password/i);
		await currentPwField.click();
		await currentPwField.fill("x");
		await currentPwField.clear();

		// Submit empty form
		await page
			.getByRole("button", { name: /change password/i })
			.click();

		await expect(
			page.getByText(/current password is required/i),
		).toBeVisible();
		await expect(
			page.getByText(/new password is required/i),
		).toBeVisible();
	});

	test("should show mismatch error when passwords differ", async ({
		page,
	}) => {
		await loginViaOidc(page, ADMIN_USERNAME, ADMIN_PASSWORD);
		await page.goto("/profile/security");
		await page.waitForLoadState("networkidle");

		await expect(page.getByText(/change password/i).first()).toBeVisible({
			timeout: 10000,
		});

		// Ensure hydration
		const currentPwField = page.getByLabel(/current password/i);
		await currentPwField.click();

		await currentPwField.fill(ADMIN_PASSWORD);
		await page.getByLabel(/^new password/i).fill("NewPass1");
		await page
			.getByLabel(/confirm new password/i)
			.fill("DifferentPass1");

		await page
			.getByRole("button", { name: /change password/i })
			.click();

		await expect(
			page.getByText(/passwords do not match/i),
		).toBeVisible();
	});
});
