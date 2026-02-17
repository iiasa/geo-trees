import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TenantForm } from "../tenant-form";
import type { TenantDto } from "@/infrastructure/api/types.gen";

// Mock tenant form store - use vi.hoisted to ensure the mock is accessible
const { mockResetForm } = vi.hoisted(() => ({
	mockResetForm: vi.fn(),
}));

vi.mock("../stores/tenant-form-store", () => ({
	useTenantFormStore: () => ({
		formData: {
			name: "",
			adminEmailAddress: "",
			adminPassword: "",
		},
		resetForm: mockResetForm,
	}),
}));

describe("TenantForm", () => {
	const mockOnSubmit = vi.fn();
	const mockOnOpenChange = vi.fn();

	const defaultProps = {
		open: true,
		onOpenChange: mockOnOpenChange,
		onSubmit: mockOnSubmit,
		isLoading: false,
		mode: "create" as const,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render create form", () => {
		render(<TenantForm {...defaultProps} />);

		expect(screen.getByText("Create New Tenant")).toBeInTheDocument();
		expect(
			screen.getByText("Create a new tenant with an admin account."),
		).toBeInTheDocument();
		expect(screen.getByTestId("field-name")).toBeInTheDocument();
		expect(screen.getByTestId("field-adminEmailAddress")).toBeInTheDocument();
		expect(screen.getByTestId("field-adminPassword")).toBeInTheDocument();
		expect(screen.getByTestId("btn-submit")).toBeInTheDocument();
	});

	it("should render edit form", () => {
		const mockTenant: TenantDto = {
			id: "1",
			name: "Test Tenant",
		};

		render(<TenantForm {...defaultProps} tenant={mockTenant} mode="edit" />);

		expect(screen.getByText("Edit Tenant")).toBeInTheDocument();
		expect(
			screen.getByText("Update the tenant information."),
		).toBeInTheDocument();
		expect(screen.getByDisplayValue("Test Tenant")).toBeInTheDocument();
		expect(screen.getByText("Update")).toBeInTheDocument();
	});

	it("should not show admin fields in edit mode", () => {
		const mockTenant: TenantDto = {
			id: "1",
			name: "Test Tenant",
		};

		render(<TenantForm {...defaultProps} tenant={mockTenant} mode="edit" />);

		expect(
			screen.queryByTestId("field-adminEmailAddress"),
		).not.toBeInTheDocument();
		expect(screen.queryByTestId("field-adminPassword")).not.toBeInTheDocument();
	});

	it("should validate required fields", async () => {
		const user = userEvent.setup();
		render(<TenantForm {...defaultProps} />);

		// Try to submit without entering name
		const submitButton = screen.getByTestId("btn-submit");
		await user.click(submitButton);

		// Should show validation error
		await waitFor(() => {
			expect(screen.getByText("Name is required")).toBeInTheDocument();
		});

		// Should not have called onSubmit
		expect(mockOnSubmit).not.toHaveBeenCalled();
	});

	it("should validate password length", async () => {
		const user = userEvent.setup();
		render(<TenantForm {...defaultProps} />);

		// Fill form with short password
		const nameInput = screen.getByTestId("field-name");
		const emailInput = screen.getByTestId("field-adminEmailAddress");
		const passwordInput = screen.getByTestId("field-adminPassword");
		await user.type(nameInput, "Test Tenant");
		await user.type(emailInput, "admin@test.com");
		await user.type(passwordInput, "123");

		// Submit form
		const submitButton = screen.getByTestId("btn-submit");
		await user.click(submitButton);

		// Should show validation error
		await waitFor(() => {
			expect(
				screen.getByText("Password must be at least 6 characters"),
			).toBeInTheDocument();
		});
	});

	it("should submit form with valid data in create mode", async () => {
		const user = userEvent.setup();
		const mockSubmit = vi.fn().mockResolvedValue(undefined);

		render(<TenantForm {...defaultProps} onSubmit={mockSubmit} />);

		// Fill form
		const nameInput = screen.getByTestId("field-name");
		const emailInput = screen.getByTestId("field-adminEmailAddress");
		const passwordInput = screen.getByTestId("field-adminPassword");
		await user.type(nameInput, "Test Tenant");
		await user.type(emailInput, "admin@test.com");
		await user.type(passwordInput, "password123");

		// Submit form
		const submitButton = screen.getByTestId("btn-submit");
		await user.click(submitButton);

		await waitFor(() => {
			expect(mockSubmit).toHaveBeenCalledWith({
				name: "Test Tenant",
				adminEmailAddress: "admin@test.com",
				adminPassword: "password123",
			});
		});

		// Should close form and reset
		expect(mockOnOpenChange).toHaveBeenCalledWith(false);
	});

	it("should submit form with valid data in edit mode", async () => {
		const user = userEvent.setup();
		const mockSubmit = vi.fn().mockResolvedValue(undefined);
		const mockTenant: TenantDto = {
			id: "1",
			name: "Original Name",
		};

		render(
			<TenantForm
				{...defaultProps}
				tenant={mockTenant}
				mode="edit"
				onSubmit={mockSubmit}
			/>,
		);

		// Update name
		const nameInput = screen.getByTestId("field-name");
		await user.clear(nameInput);
		await user.type(nameInput, "Updated Tenant");

		// Submit form
		const submitButton = screen.getByTestId("btn-submit");
		await user.click(submitButton);

		await waitFor(() => {
			expect(mockSubmit).toHaveBeenCalledWith({
				name: "Updated Tenant",
			});
		});
	});

	it("should show loading state", () => {
		render(<TenantForm {...defaultProps} isLoading={true} />);

		expect(screen.getByText("Create")).toBeInTheDocument();
		expect(screen.getByTestId("btn-submit")).toBeDisabled();
	});

	it("should handle cancel action", async () => {
		const user = userEvent.setup();
		render(<TenantForm {...defaultProps} />);

		const cancelButton = screen.getByText("Cancel");
		await user.click(cancelButton);

		expect(mockOnOpenChange).toHaveBeenCalledWith(false);
	});
});
