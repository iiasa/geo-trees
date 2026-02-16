import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProtectedRoute } from "./protected-route";

// Mock the useAuth hook
const mockUseAuth = vi.fn();
vi.mock("../hooks/use-auth", () => ({
	useAuth: () => mockUseAuth(),
}));

describe("ProtectedRoute component", () => {
	it("should render children when authenticated", () => {
		mockUseAuth.mockReturnValue({
			authState: {
				isAuthenticated: true,
				isLoading: false,
				user: { sub: "user-1", name: "Test User" },
			},
		});

		render(
			<ProtectedRoute>
				<div data-testid="protected-content">Protected Content</div>
			</ProtectedRoute>,
		);

		expect(screen.getByTestId("protected-content")).toBeInTheDocument();
		expect(screen.getByText("Protected Content")).toBeInTheDocument();
	});

	it("should show loading state when checking authentication", () => {
		mockUseAuth.mockReturnValue({
			authState: {
				isAuthenticated: false,
				isLoading: true,
				user: null,
			},
		});

		render(
			<ProtectedRoute>
				<div>Should not render</div>
			</ProtectedRoute>,
		);

		expect(screen.getByText("Checking authentication...")).toBeInTheDocument();
		// Check for the loading spinner (div with animate-spin class)
		const spinner = document.querySelector(".animate-spin");
		expect(spinner).toBeInTheDocument();
	});

	it("should show custom loading component", () => {
		mockUseAuth.mockReturnValue({
			authState: {
				isAuthenticated: false,
				isLoading: true,
				user: null,
			},
		});

		render(
			<ProtectedRoute
				loading={<div data-testid="custom-loading">Custom Loading</div>}
			>
				<div>Should not render</div>
			</ProtectedRoute>,
		);

		expect(screen.getByTestId("custom-loading")).toBeInTheDocument();
		expect(screen.getByText("Custom Loading")).toBeInTheDocument();
	});

	it("should show fallback when not authenticated", () => {
		mockUseAuth.mockReturnValue({
			authState: {
				isAuthenticated: false,
				isLoading: false,
				user: null,
			},
		});

		render(
			<ProtectedRoute>
				<div>Should not render</div>
			</ProtectedRoute>,
		);

		expect(screen.getByText("Authentication Required")).toBeInTheDocument();
		expect(
			screen.getByText("You need to be logged in to access this page."),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /go to home/i }),
		).toBeInTheDocument();
	});

	it("should show custom fallback component", () => {
		mockUseAuth.mockReturnValue({
			authState: {
				isAuthenticated: false,
				isLoading: false,
				user: null,
			},
		});

		render(
			<ProtectedRoute
				fallback={<div data-testid="custom-fallback">Custom Fallback</div>}
			>
				<div>Should not render</div>
			</ProtectedRoute>,
		);

		expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
		expect(screen.getByText("Custom Fallback")).toBeInTheDocument();
	});

	it("should handle authentication state changes", () => {
		// Start as loading
		mockUseAuth.mockReturnValue({
			authState: {
				isAuthenticated: false,
				isLoading: true,
				user: null,
			},
		});

		const { rerender } = render(
			<ProtectedRoute>
				<div data-testid="content">Content</div>
			</ProtectedRoute>,
		);

		expect(screen.getByText("Checking authentication...")).toBeInTheDocument();

		// Change to authenticated
		mockUseAuth.mockReturnValue({
			authState: {
				isAuthenticated: true,
				isLoading: false,
				user: { sub: "user-1", name: "Test User" },
			},
		});

		rerender(
			<ProtectedRoute>
				<div data-testid="content">Content</div>
			</ProtectedRoute>,
		);

		expect(screen.getByTestId("content")).toBeInTheDocument();
	});
});
