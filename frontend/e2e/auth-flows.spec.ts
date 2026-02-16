// Allow self-signed certs for direct backend API calls
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { test, expect } from "@playwright/test";

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
const BACKEND_URL = process.env.BACKEND_URL || "https://localhost:44324";
const ADMIN_PASSWORD = "1q2w3E*";

// --- Types ---

type TestUser = {
	id: string;
	username: string;
	email: string;
	password: string;
};

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

async function findEmailByTo(
	toAddress: string,
	retries = 10,
	subjectPattern?: RegExp,
) {
	for (let i = 0; i < retries; i++) {
		const messages = await getMailpitMessages(1, 0);
		const match = messages.find(
			(m: { To: { Address: string }[]; Subject: string }) =>
				m.To.some((t: { Address: string }) => t.Address === toAddress) &&
				(!subjectPattern || subjectPattern.test(m.Subject)),
		);
		if (match) return match;
		await new Promise((r) => setTimeout(r, 1000));
	}
	return undefined;
}

/** Fetch the full HTML body of an email from Mailpit */
async function getEmailBody(messageId: string): Promise<string> {
	const res = await fetch(`${MAILPIT_API}/message/${messageId}`);
	const data = await res.json();
	return data.HTML || data.Text || "";
}

/** Extract the confirmation URL from the email HTML */
function extractConfirmationUrl(html: string): string | null {
	const match = html.match(/href="([^"]*\/auth\/confirm-email\?[^"]*)"/);
	if (!match) return null;
	// Decode HTML entities (e.g. &amp; -> &)
	return match[1].replace(/&amp;/g, "&");
}

function generateTestUser() {
	const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
	return {
		username: `testuser_${id}`,
		email: `testuser_${id}@test.local`,
		password: "TestPass1!",
	};
}

/** Get admin session (cookies + XSRF token) for authenticated API calls */
async function getAdminSession(): Promise<{ cookies: string; xsrf: string }> {
	const loginRes = await fetch(`${BACKEND_URL}/api/account/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			userNameOrEmailAddress: "admin",
			password: ADMIN_PASSWORD,
			rememberMe: false,
		}),
	});

	if (!loginRes.ok) {
		throw new Error(`Admin login failed (${loginRes.status})`);
	}

	const loginCookies = loginRes.headers.getSetCookie?.() || [];

	// Fetch ABP config to get XSRF cookie
	const configRes = await fetch(
		`${BACKEND_URL}/api/abp/application-configuration`,
		{ headers: { Cookie: loginCookies.map((c) => c.split(";")[0]).join("; ") } },
	);
	const configCookies = configRes.headers.getSetCookie?.() || [];

	const allCookies = [...loginCookies, ...configCookies];
	const cookies = allCookies.map((c) => c.split(";")[0]).join("; ");
	const xsrfCookie = allCookies.find((c) => c.startsWith("XSRF-TOKEN="));
	const xsrf = xsrfCookie
		? decodeURIComponent(xsrfCookie.split(";")[0].replace("XSRF-TOKEN=", ""))
		: "";

	return { cookies, xsrf };
}

/** Register a user, confirm email via welcome email link, return user details */
async function createAndConfirmUser(
	page: import("@playwright/test").Page,
): Promise<TestUser> {
	const user = generateTestUser();

	// Clear mailpit so we only see this user's welcome email
	await clearMailpit();

	// Register via backend API
	const res = await fetch(`${BACKEND_URL}/api/account/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			userName: user.username,
			emailAddress: user.email,
			password: user.password,
			appName: "GeoTrees",
		}),
	});

	if (!res.ok) {
		const err = await res.text();
		throw new Error(`Registration failed (${res.status}): ${err}`);
	}

	const data = await res.json();

	// Wait for welcome email
	const welcomeEmail = await findEmailByTo(user.email, 15);
	if (!welcomeEmail) {
		throw new Error(`Welcome email not received for ${user.email}`);
	}

	// Extract confirmation link from email
	const emailHtml = await getEmailBody(welcomeEmail.ID);
	const confirmUrl = extractConfirmationUrl(emailHtml);
	if (!confirmUrl) {
		throw new Error("Could not find confirmation link in welcome email");
	}

	// Visit the confirmation URL in the browser
	await page.goto(confirmUrl);

	// Wait for the confirmation success
	await page.waitForSelector('text="Email Confirmed"', { timeout: 15000 });

	return {
		id: data.id,
		username: user.username,
		email: user.email,
		password: user.password,
	};
}

/** Delete a user via admin API */
async function deleteUser(userId: string): Promise<void> {
	try {
		const { cookies, xsrf } = await getAdminSession();
		const deleteRes = await fetch(
			`${BACKEND_URL}/api/identity/users/${userId}`,
			{
				method: "DELETE",
				headers: {
					Cookie: cookies,
					RequestVerificationToken: xsrf,
				},
			},
		);

		if (!deleteRes.ok && deleteRes.status !== 404) {
			console.warn(`Failed to delete user ${userId}: ${deleteRes.status}`);
		}
	} catch (err) {
		console.warn(`User cleanup failed for ${userId}:`, err);
	}
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
	let testUser: TestUser;

	test.beforeEach(async ({ page }) => {
		testUser = await createAndConfirmUser(page);
	});

	test.afterEach(async () => {
		if (testUser?.id) {
			await deleteUser(testUser.id);
		}
	});

	test("should login with valid credentials via OIDC", async ({ page }) => {
		await loginViaOidc(page, testUser.username, testUser.password);

		// Should see authenticated content (redirects to dashboard)
		await expect(
			page.getByText(new RegExp(`welcome,?\\s*${testUser.username}`, "i")),
		).toBeVisible({ timeout: 10000 });
	});

	test("should show error for invalid credentials", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("button", { name: /sign in/i }).click();

		await page.waitForURL(/\/Account\/Login/i, { timeout: 15000 });

		await page
			.locator("#LoginInput_UserNameOrEmailAddress")
			.fill(testUser.username);
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
	test("should send password reset email", async ({ page }) => {
		const testUser = await createAndConfirmUser(page);

		try {
			// Clear Mailpit after user creation so we only see the reset email
			await clearMailpit();

			await page.goto("/auth/forgot-password");
			await page.waitForLoadState("networkidle");

			await page.getByRole("textbox", { name: /email/i }).click();
			await page.getByRole("textbox", { name: /email/i }).fill(testUser.email);
			await page.getByRole("button", { name: /send reset code/i }).click();

			// Should see success screen
			await expect(
				page.getByText(/check your email/i).first(),
			).toBeVisible({ timeout: 10000 });

			// Check Mailpit for the reset email
			const resetEmail = await findEmailByTo(testUser.email);
			expect(resetEmail).toBeTruthy();
		} finally {
			await deleteUser(testUser.id);
		}
	});

	test("should show error for non-existent email", async ({ page }) => {
		await page.goto("/auth/forgot-password");
		await page.waitForLoadState("networkidle");

		await page.getByRole("textbox", { name: /email/i }).click();
		await page.getByRole("textbox", { name: /email/i }).fill("nonexistent@test.local");
		await page.getByRole("button", { name: /send reset code/i }).click();

		// ABP returns an error for non-existent emails
		await expect(
			page
				.locator("[data-sonner-toaster]")
				.getByText(/failed|error|not find/i),
		).toBeVisible({ timeout: 10000 });
	});

	test("should show validation error for empty email", async ({ page }) => {
		await page.goto("/auth/forgot-password");
		await page.waitForLoadState("networkidle");

		// Ensure hydration by interacting with the field first
		const emailField = page.getByRole("textbox", { name: /email/i });
		await emailField.click();
		await emailField.fill("x");
		await emailField.clear();

		await page.getByRole("button", { name: /send reset code/i }).click();

		await expect(page.getByText(/email is required/i)).toBeVisible();
	});
});

test.describe("Change Password Flow", () => {
	let testUser: TestUser;

	test.beforeEach(async ({ page }) => {
		testUser = await createAndConfirmUser(page);
	});

	test.afterEach(async () => {
		if (testUser?.id) {
			await deleteUser(testUser.id);
		}
	});

	test("should change password for logged-in user", async ({ page }) => {
		// Login first
		await loginViaOidc(page, testUser.username, testUser.password);

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
		await currentPwField.fill(testUser.password);
		const newPassword = "NewPass1!";
		await page.getByLabel(/^new password/i).fill(newPassword);
		await page.getByLabel(/confirm new password/i).fill(newPassword);

		// Submit
		await page
			.getByRole("button", { name: /change password/i })
			.click();

		// Should see success toast
		await expect(
			page
				.locator("[data-sonner-toaster]")
				.getByText(/password changed/i),
		).toBeVisible({ timeout: 10000 });
	});

	test("should show validation errors for empty change password form", async ({
		page,
	}) => {
		await loginViaOidc(page, testUser.username, testUser.password);
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
		await loginViaOidc(page, testUser.username, testUser.password);
		await page.goto("/profile/security");
		await page.waitForLoadState("networkidle");

		await expect(page.getByText(/change password/i).first()).toBeVisible({
			timeout: 10000,
		});

		// Ensure hydration
		const currentPwField = page.getByLabel(/current password/i);
		await currentPwField.click();

		await currentPwField.fill(testUser.password);
		await page.getByLabel(/^new password/i).fill("NewPass1!");
		await page
			.getByLabel(/confirm new password/i)
			.fill("DifferentPass1!");

		await page
			.getByRole("button", { name: /change password/i })
			.click();

		await expect(
			page.getByText(/passwords do not match/i),
		).toBeVisible();
	});
});
