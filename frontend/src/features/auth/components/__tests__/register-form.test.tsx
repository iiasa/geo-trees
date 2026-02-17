import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	AUTH_ROUTES,
	REGISTER_LABELS,
	REGISTER_VALIDATION,
} from "@/features/auth/constants";
import { RegisterForm } from "../register-form";

// Mock sonner
vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

// Mock TanStack Router Link
vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
		<a href={to}>{children}</a>
	),
}));

// Mock the register mutation
const mockMutate = vi.fn();
vi.mock("@/infrastructure/api/@tanstack/react-query.gen", () => ({
	postApiAccountRegisterMutation: () => ({
		mutationFn: mockMutate,
	}),
}));

// Mock AuthProvider to avoid auth/me fetch dependency
vi.mock("@/features/auth/hooks/use-auth", () => ({
	AuthProvider: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
	useAuth: () => ({
		user: null,
		isLoading: false,
		isAuthenticated: false,
		error: undefined,
	}),
}));

function renderWithQueryClient(ui: React.ReactElement) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});
	return require("@testing-library/react").render(ui, {
		wrapper: ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		),
	});
}

describe("RegisterForm", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders all form fields", () => {
		renderWithQueryClient(<RegisterForm />);

		expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
		expect(
			screen.getByLabelText(/^password/i, { selector: "input" }),
		).toBeInTheDocument();
		expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/institution/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
		expect(screen.getByRole("checkbox")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: REGISTER_LABELS.SUBMIT }),
		).toBeInTheDocument();
		expect(
			screen.getByText(REGISTER_LABELS.TITLE, {
				selector: "[data-slot='card-title']",
			}),
		).toBeInTheDocument();
	});

	it("shows validation errors when submitting empty form", async () => {
		const user = userEvent.setup();
		renderWithQueryClient(<RegisterForm />);

		const submitButton = screen.getByRole("button", {
			name: REGISTER_LABELS.SUBMIT,
		});
		await user.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText(REGISTER_VALIDATION.USERNAME.REQUIRED),
			).toBeInTheDocument();
			expect(
				screen.getByText(REGISTER_VALIDATION.EMAIL.REQUIRED),
			).toBeInTheDocument();
			expect(
				screen.getByText(REGISTER_VALIDATION.PASSWORD.REQUIRED),
			).toBeInTheDocument();
			expect(
				screen.getByText(REGISTER_VALIDATION.PASSWORD.CONFIRM_REQUIRED),
			).toBeInTheDocument();
			expect(
				screen.getByText(REGISTER_VALIDATION.INSTITUTION.REQUIRED),
			).toBeInTheDocument();
			expect(
				screen.getByText(REGISTER_VALIDATION.COUNTRY.REQUIRED),
			).toBeInTheDocument();
			expect(
				screen.getByText(REGISTER_VALIDATION.TERMS.REQUIRED),
			).toBeInTheDocument();
		});
	});

	it("shows email validation error for invalid email", async () => {
		const user = userEvent.setup();
		renderWithQueryClient(<RegisterForm />);

		const emailInput = screen.getByLabelText(/email address/i);
		await user.clear(emailInput);
		// Use a value that passes HTML5 email validation but fails the component's regex
		// (component requires format: name@domain.tld)
		await user.type(emailInput, "test@test");

		// Also fill username to avoid it being the first error
		await user.type(screen.getByLabelText(/username/i), "testuser");

		const submitButton = screen.getByRole("button", {
			name: REGISTER_LABELS.SUBMIT,
		});
		await user.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText(REGISTER_VALIDATION.EMAIL.INVALID),
			).toBeInTheDocument();
		});
	});

	it("shows password mismatch error", async () => {
		const user = userEvent.setup();
		renderWithQueryClient(<RegisterForm />);

		const passwordInput = screen.getByLabelText(/^password/i, {
			selector: "input",
		});
		const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

		await user.type(passwordInput, "ValidPass1");
		await user.type(confirmPasswordInput, "DifferentPass1");

		const submitButton = screen.getByRole("button", {
			name: REGISTER_LABELS.SUBMIT,
		});
		await user.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText(REGISTER_VALIDATION.PASSWORD.MISMATCH),
			).toBeInTheDocument();
		});
	});

	it("shows terms acceptance error when all fields filled but terms unchecked", async () => {
		const user = userEvent.setup();
		renderWithQueryClient(<RegisterForm />);

		await user.type(screen.getByLabelText(/username/i), "testuser");
		await user.type(
			screen.getByLabelText(/email address/i),
			"test@example.com",
		);
		await user.type(
			screen.getByLabelText(/^password/i, { selector: "input" }),
			"ValidPass1",
		);
		await user.type(screen.getByLabelText(/confirm password/i), "ValidPass1");
		await user.type(screen.getByLabelText(/institution/i), "MIT");
		await user.type(screen.getByLabelText(/country/i), "USA");

		const submitButton = screen.getByRole("button", {
			name: REGISTER_LABELS.SUBMIT,
		});
		await user.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText(REGISTER_VALIDATION.TERMS.REQUIRED),
			).toBeInTheDocument();
		});

		// Other validation errors should NOT be present
		expect(
			screen.queryByText(REGISTER_VALIDATION.USERNAME.REQUIRED),
		).not.toBeInTheDocument();
		expect(
			screen.queryByText(REGISTER_VALIDATION.EMAIL.REQUIRED),
		).not.toBeInTheDocument();
		expect(
			screen.queryByText(REGISTER_VALIDATION.PASSWORD.REQUIRED),
		).not.toBeInTheDocument();
	});

	it("shows email verification success screen after registration", async () => {
		mockMutate.mockResolvedValueOnce({});
		const user = userEvent.setup();
		renderWithQueryClient(<RegisterForm />);

		await user.type(screen.getByLabelText(/username/i), "testuser");
		await user.type(
			screen.getByLabelText(/email address/i),
			"test@example.com",
		);
		await user.type(
			screen.getByLabelText(/^password/i, { selector: "input" }),
			"ValidPass1",
		);
		await user.type(screen.getByLabelText(/confirm password/i), "ValidPass1");
		await user.type(screen.getByLabelText(/institution/i), "MIT");
		await user.type(screen.getByLabelText(/country/i), "USA");

		const checkbox = screen.getByRole("checkbox");
		await user.click(checkbox);

		const submitButton = screen.getByRole("button", {
			name: REGISTER_LABELS.SUBMIT,
		});
		await user.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText(REGISTER_LABELS.SUCCESS_TITLE),
			).toBeInTheDocument();
		});

		expect(
			screen.getByText(REGISTER_LABELS.SUCCESS_MESSAGE),
		).toBeInTheDocument();
		expect(screen.getByText(/test@example\.com/)).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: new RegExp(REGISTER_LABELS.SIGN_IN) }),
		).toHaveAttribute("href", AUTH_ROUTES.LOGIN);
	});

	it("calls register mutation with correct data on successful submission", async () => {
		const user = userEvent.setup();
		renderWithQueryClient(<RegisterForm />);

		await user.type(screen.getByLabelText(/username/i), "testuser");
		await user.type(
			screen.getByLabelText(/email address/i),
			"test@example.com",
		);
		await user.type(
			screen.getByLabelText(/^password/i, { selector: "input" }),
			"ValidPass1",
		);
		await user.type(screen.getByLabelText(/confirm password/i), "ValidPass1");
		await user.type(screen.getByLabelText(/institution/i), "MIT");
		await user.type(screen.getByLabelText(/country/i), "USA");

		const checkbox = screen.getByRole("checkbox");
		await user.click(checkbox);

		const submitButton = screen.getByRole("button", {
			name: REGISTER_LABELS.SUBMIT,
		});
		await user.click(submitButton);

		await waitFor(() => {
			expect(mockMutate).toHaveBeenCalled();
		});

		const callArgs = mockMutate.mock.calls[0][0];
		expect(callArgs.body.userName).toBe("testuser");
		expect(callArgs.body.emailAddress).toBe("test@example.com");
		expect(callArgs.body.password).toBe("ValidPass1");
		expect(callArgs.body.appName).toBe("Geo Trees");
		expect(callArgs.body.extraProperties).toEqual({
			Institution: "MIT",
			Country: "USA",
		});
	});
});
