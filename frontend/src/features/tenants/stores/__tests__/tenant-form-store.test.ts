import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useTenantFormStore } from "../tenant-form-store";
import type { TenantDto } from "@/infrastructure/api/types.gen";

describe("useTenantFormStore", () => {
	let mockTenant: TenantDto;

	beforeEach(() => {
		// Reset store state before each test
		const store = useTenantFormStore.getState();
		store.closeForm();
		store.setLoading(false);

		mockTenant = {
			id: "1",
			name: "Test Tenant",
		};
	});

	it("should have correct initial state", () => {
		const { result } = renderHook(() => useTenantFormStore());

		expect(result.current.tenant).toBe(null);
		expect(result.current.open).toBe(false);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.error).toBe(null);
		expect(result.current.formData).toEqual({
			name: "",
			adminEmailAddress: "",
			adminPassword: "",
			isActive: true,
		});
	});

	it("should open create form", () => {
		const { result } = renderHook(() => useTenantFormStore());

		act(() => {
			result.current.openCreateForm();
		});

		expect(result.current.open).toBe(true);
		expect(result.current.tenant).toBe(null);
	});

	it("should open edit form with tenant", () => {
		const { result } = renderHook(() => useTenantFormStore());

		act(() => {
			result.current.openEditForm(mockTenant);
		});

		expect(result.current.open).toBe(true);
		expect(result.current.tenant).toEqual(mockTenant);
	});

	it("should close form and reset tenant", () => {
		const { result } = renderHook(() => useTenantFormStore());

		// First open edit form
		act(() => {
			result.current.openEditForm(mockTenant);
		});

		expect(result.current.open).toBe(true);
		expect(result.current.tenant).toEqual(mockTenant);

		// Then close form
		act(() => {
			result.current.closeForm();
		});

		expect(result.current.open).toBe(false);
		expect(result.current.tenant).toBe(null);
	});

	it("should set loading state", () => {
		const { result } = renderHook(() => useTenantFormStore());

		act(() => {
			result.current.setLoading(true);
		});

		expect(result.current.isLoading).toBe(true);

		act(() => {
			result.current.setLoading(false);
		});

		expect(result.current.isLoading).toBe(false);
	});

	it("should update form data", () => {
		const { result } = renderHook(() => useTenantFormStore());

		act(() => {
			result.current.updateFormData({
				name: "Updated Tenant",
				adminEmailAddress: "admin@test.com",
			});
		});

		expect(result.current.formData.name).toBe("Updated Tenant");
		expect(result.current.formData.adminEmailAddress).toBe("admin@test.com");
		expect(result.current.formData.adminPassword).toBe("");
	});

	it("should reset form data", () => {
		const { result } = renderHook(() => useTenantFormStore());

		// Update form data
		act(() => {
			result.current.updateFormData({
				name: "Updated Tenant",
				adminEmailAddress: "admin@test.com",
				adminPassword: "password123",
			});
		});

		expect(result.current.formData.name).toBe("Updated Tenant");

		// Reset form
		act(() => {
			result.current.resetForm();
		});

		expect(result.current.formData).toEqual({
			name: "",
			adminEmailAddress: "",
			adminPassword: "",
			isActive: true,
		});
	});

	it("should handle form state transitions", () => {
		const { result } = renderHook(() => useTenantFormStore());

		// Start with closed form
		expect(result.current.open).toBe(false);
		expect(result.current.tenant).toBe(null);

		// Open create form
		act(() => {
			result.current.openCreateForm();
		});
		expect(result.current.open).toBe(true);
		expect(result.current.tenant).toBe(null);

		// Close form
		act(() => {
			result.current.closeForm();
		});
		expect(result.current.open).toBe(false);
		expect(result.current.tenant).toBe(null);

		// Open edit form
		act(() => {
			result.current.openEditForm(mockTenant);
		});
		expect(result.current.open).toBe(true);
		expect(result.current.tenant).toEqual(mockTenant);

		// Close form again
		act(() => {
			result.current.closeForm();
		});
		expect(result.current.open).toBe(false);
		expect(result.current.tenant).toBe(null);
	});
});
