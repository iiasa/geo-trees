import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "../hooks/use-auth";

// Mock fetch for external API calls
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe.skip("Auth Flow Integration", () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});
		vi.clearAllMocks();
	});

	it("should handle complete login flow", async () => {
		const user = userEvent.setup();

		// Mock successful auth check
		fetchMock.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ user: null }),
		});

		// Mock successful login initiation
		fetchMock.mockResolvedValueOnce({
			ok: true,
			json: () =>
				Promise.resolve({
					authUrl: "https://mock-oidc.com/auth",
				}),
		});

		// Mock window.location.href
		const originalLocation = window.location.href;
		let currentLocation = originalLocation;
		Object.defineProperty(window, "location", {
			value: {
				get href() {
					return currentLocation;
				},
				set href(value: string) {
					currentLocation = value;
				},
			},
			writable: true,
		});

		function TestComponent() {
			const { authState, login } = useAuth();

			return (
				<div>
					<div data-testid="auth-status">
						{authState.isLoading
							? "Loading..."
							: authState.isAuthenticated
								? "Authenticated"
								: "Not Authenticated"}
					</div>
					<button type="button" onClick={login} data-testid="login-button">
						Login
					</button>
				</div>
			);
		}

		render(
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<TestComponent />
				</AuthProvider>
			</QueryClientProvider>,
		);

		// Initially should be loading
		expect(screen.getByTestId("auth-status")).toHaveTextContent("Loading...");

		// Wait for initial auth check to complete
		await waitFor(() => {
			expect(screen.getByTestId("auth-status")).toHaveTextContent(
				"Not Authenticated",
			);
		});

		// Click login button
		await user.click(screen.getByTestId("login-button"));

		// Should redirect to auth URL
		await waitFor(() => {
			expect(currentLocation).toBe("https://mock-oidc.com/auth");
		});

		// Verify fetch was called for login
		expect(fetchMock).toHaveBeenCalledWith("/auth/login");
	});

	it("should handle login errors gracefully", async () => {
		const user = userEvent.setup();

		// Mock auth check
		fetchMock.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ user: null }),
		});

		// Mock failed login
		fetchMock.mockResolvedValueOnce({
			ok: false,
			status: 500,
			text: () => Promise.resolve("OIDC configuration error"),
		});

		function TestComponent() {
			const { authState, login } = useAuth();

			return (
				<div>
					<div data-testid="auth-status">
						{authState.isLoading
							? "Loading..."
							: authState.isAuthenticated
								? "Authenticated"
								: "Not Authenticated"}
					</div>
					<div data-testid="error-message">{authState.error || ""}</div>
					<button type="button" onClick={login} data-testid="login-button">
						Login
					</button>
				</div>
			);
		}

		render(
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<TestComponent />
				</AuthProvider>
			</QueryClientProvider>,
		);

		// Wait for initial load
		await waitFor(() => {
			expect(screen.getByTestId("auth-status")).toHaveTextContent(
				"Not Authenticated",
			);
		});

		// Click login button
		await user.click(screen.getByTestId("login-button"));

		// Should show error message
		await waitFor(() => {
			expect(screen.getByTestId("error-message")).toHaveTextContent(
				"Server error during login. Please try again later.",
			);
		});
	});

	it("should handle successful logout flow", async () => {
		const user = userEvent.setup();

		// Mock authenticated user
		fetchMock.mockResolvedValueOnce({
			ok: true,
			json: () =>
				Promise.resolve({
					user: { sub: "user-1", name: "Test User" },
				}),
		});

		// Mock successful logout
		fetchMock.mockResolvedValueOnce({
			redirected: true,
			url: "/",
		});

		// Mock window.location.href
		let currentLocation = "/dashboard";
		Object.defineProperty(window, "location", {
			value: {
				get href() {
					return currentLocation;
				},
				set href(value: string) {
					currentLocation = value;
				},
			},
			writable: true,
		});

		function TestComponent() {
			const { authState, logout } = useAuth();

			return (
				<div>
					<div data-testid="auth-status">
						{authState.isLoading
							? "Loading..."
							: authState.isAuthenticated
								? "Authenticated"
								: "Not Authenticated"}
					</div>
					<button type="button" onClick={logout} data-testid="logout-button">
						Logout
					</button>
				</div>
			);
		}

		render(
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<TestComponent />
				</AuthProvider>
			</QueryClientProvider>,
		);

		// Wait for authentication
		await waitFor(() => {
			expect(screen.getByTestId("auth-status")).toHaveTextContent(
				"Authenticated",
			);
		});

		// Click logout button
		await user.click(screen.getByTestId("logout-button"));

		// Should redirect to home
		await waitFor(() => {
			expect(currentLocation).toBe("/");
		});

		// Verify fetch was called for logout
		expect(fetchMock).toHaveBeenCalledWith("/auth/logout");
	});

	it("should handle auth state persistence", async () => {
		const user = userEvent.setup();

		// Mock authenticated user
		fetchMock.mockResolvedValue({
			ok: true,
			json: () =>
				Promise.resolve({
					user: { sub: "user-1", name: "Test User", email: "test@example.com" },
				}),
		});

		function TestComponent() {
			const { authState, refresh } = useAuth();

			return (
				<div>
					<div data-testid="auth-status">
						{authState.isLoading
							? "Loading..."
							: authState.isAuthenticated
								? "Authenticated"
								: "Not Authenticated"}
					</div>
					<div data-testid="user-info">
						{authState.user ? `User: ${authState.user.name}` : "No user"}
					</div>
					<button type="button" onClick={refresh} data-testid="refresh-button">
						Refresh
					</button>
				</div>
			);
		}

		render(
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<TestComponent />
				</AuthProvider>
			</QueryClientProvider>,
		);

		// Wait for authentication
		await waitFor(() => {
			expect(screen.getByTestId("auth-status")).toHaveTextContent(
				"Authenticated",
			);
		});

		expect(screen.getByTestId("user-info")).toHaveTextContent(
			"User: Test User",
		);

		// Refresh auth state
		await user.click(screen.getByTestId("refresh-button"));

		// Should still be authenticated with same user
		await waitFor(() => {
			expect(screen.getByTestId("auth-status")).toHaveTextContent(
				"Authenticated",
			);
			expect(screen.getByTestId("user-info")).toHaveTextContent(
				"User: Test User",
			);
		});
	});
});
