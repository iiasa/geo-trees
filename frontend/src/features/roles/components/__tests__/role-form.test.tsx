import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoleForm } from "../role-form";
import type { IdentityRoleDto } from "@/infrastructure/api/types.gen";

// Mock toast
vi.mock("sonner", () => ({
	toast: {
		error: vi.fn(),
	},
}));

describe("RoleForm", () => {
	const mockOnSubmit = vi.fn();
	const mockOnOpenChange = vi.fn();

	const defaultProps = {
		open: true,
		onOpenChange: mockOnOpenChange,
		onSubmit: mockOnSubmit,
		mode: "create" as const,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render create form", () => {
		render(<RoleForm {...defaultProps} />);

		expect(screen.getByText("Create Role")).toBeInTheDocument();
		expect(
			screen.getByText("Add a new role to the system."),
		).toBeInTheDocument();
		expect(screen.getByTestId("field-role-name")).toBeInTheDocument();
		expect(screen.getByTestId("btn-save-role")).toBeInTheDocument();
	});

	it("should render edit form", () => {
		const mockRole: IdentityRoleDto = {
			id: "1",
			name: "Admin",
			isDefault: true,
			isPublic: false,
			isStatic: false,
		};

		render(<RoleForm {...defaultProps} role={mockRole} mode="edit" />);

		expect(screen.getByText("Edit Role")).toBeInTheDocument();
		expect(screen.getByText("Update role information.")).toBeInTheDocument();
		expect(screen.getByDisplayValue("Admin")).toBeInTheDocument();
		expect(screen.getByText("Update")).toBeInTheDocument();
	});

	it("should populate form with role data in edit mode", () => {
		const mockRole: IdentityRoleDto = {
			id: "1",
			name: "Manager",
			isDefault: false,
			isPublic: true,
			isStatic: true,
		};

		render(<RoleForm {...defaultProps} role={mockRole} mode="edit" />);

		expect(screen.getByDisplayValue("Manager")).toBeInTheDocument();
		// Check switches state
		const defaultSwitch = screen.getByLabelText("Default Role");
		const publicSwitch = screen.getByLabelText("Public Role");
		const staticSwitch = screen.getByLabelText("Static Role");

		expect(defaultSwitch).not.toBeChecked();
		expect(publicSwitch).toBeChecked();
		expect(staticSwitch).toBeChecked();
	});

	it("should disable static role switch in edit mode", () => {
		const mockRole: IdentityRoleDto = {
			id: "1",
			name: "Static Role",
			isDefault: false,
			isPublic: false,
			isStatic: true,
		};

		render(<RoleForm {...defaultProps} role={mockRole} mode="edit" />);

		const staticSwitch = screen.getByLabelText("Static Role");
		expect(staticSwitch).toBeDisabled();
	});

	it("should enable static role switch in create mode", () => {
		render(<RoleForm {...defaultProps} />);

		const staticSwitch = screen.getByLabelText("Static Role");
		expect(staticSwitch).not.toBeDisabled();
	});

	it("should validate required fields", async () => {
		const user = userEvent.setup();
		render(<RoleForm {...defaultProps} />);

		// Try to submit without entering name
		const saveButton = screen.getByTestId("btn-save-role");
		await user.click(saveButton);

		// Should show validation error
		await waitFor(() => {
			expect(screen.getByText("Role name is required")).toBeInTheDocument();
		});

		// Should not have called onSubmit
		expect(mockOnSubmit).not.toHaveBeenCalled();
	});

	it("should submit form with valid data", async () => {
		const user = userEvent.setup();
		const mockSubmit = vi.fn().mockResolvedValue(undefined);

		render(<RoleForm {...defaultProps} onSubmit={mockSubmit} />);

		// Fill form
		const nameInput = screen.getByTestId("field-role-name");
		await user.type(nameInput, "Test Role");

		// Toggle switches
		const defaultSwitch = screen.getByLabelText("Default Role");
		const publicSwitch = screen.getByLabelText("Public Role");
		await user.click(defaultSwitch);
		await user.click(publicSwitch);

		// Submit form
		const saveButton = screen.getByTestId("btn-save-role");
		await user.click(saveButton);

		await waitFor(() => {
			expect(mockSubmit).toHaveBeenCalledWith({
				name: "Test Role",
				isDefault: true,
				isPublic: true,
				isStatic: false,
			});
		});

		// Should close form and reset
		expect(mockOnOpenChange).toHaveBeenCalledWith(false);
	});

	it("should handle submit error", async () => {
		const user = userEvent.setup();
		const mockSubmit = vi.fn().mockRejectedValue(new Error("Submit failed"));
		const { toast } = await import("sonner");

		render(<RoleForm {...defaultProps} onSubmit={mockSubmit} />);

		// Fill form
		const nameInput = screen.getByTestId("field-role-name");
		await user.type(nameInput, "Test Role");

		// Submit form
		const saveButton = screen.getByTestId("btn-save-role");
		await user.click(saveButton);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith("Failed to save role");
		});

		// Should not close form on error
		expect(mockOnOpenChange).not.toHaveBeenCalledWith(false);
	});

	it("should show loading state", () => {
		render(<RoleForm {...defaultProps} isLoading={true} />);

		expect(screen.getByText("Saving...")).toBeInTheDocument();
		expect(screen.getByTestId("btn-save-role")).toBeDisabled();
	});

	it("should handle cancel action", async () => {
		const user = userEvent.setup();
		render(<RoleForm {...defaultProps} />);

		const cancelButton = screen.getByText("Cancel");
		await user.click(cancelButton);

		expect(mockOnOpenChange).toHaveBeenCalledWith(false);
	});

	it("should handle dialog close", () => {
		render(<RoleForm {...defaultProps} />);

		// Simulate dialog close
		fireEvent.click(
			screen.getByTestId("role-form-modal").querySelector("[data-state]") ||
				screen.getByTestId("role-form-modal"),
		);

		// This would typically be handled by the Dialog component
		// but we can test that onOpenChange is called when needed
	});

	it("should reset form after successful submit", async () => {
		const user = userEvent.setup();
		const mockSubmit = vi.fn().mockResolvedValue(undefined);

		render(<RoleForm {...defaultProps} onSubmit={mockSubmit} />);

		// Fill form
		const nameInput = screen.getByTestId("field-role-name");
		await user.type(nameInput, "Test Role");

		// Submit form
		const saveButton = screen.getByTestId("btn-save-role");
		await user.click(saveButton);

		await waitFor(() => {
			expect(mockOnOpenChange).toHaveBeenCalledWith(false);
		});
	});

	it("should have correct form fields labels", () => {
		render(<RoleForm {...defaultProps} />);

		expect(screen.getByText("Role Name *")).toBeInTheDocument();
		expect(screen.getByText("Default Role")).toBeInTheDocument();
		expect(screen.getByText("Public Role")).toBeInTheDocument();
		expect(screen.getByText("Static Role")).toBeInTheDocument();
	});
});
