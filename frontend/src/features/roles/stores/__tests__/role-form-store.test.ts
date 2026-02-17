import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useRoleFormStore } from "../role-form-store";
import type { IdentityRoleDto } from "@/infrastructure/api/types.gen";

describe("useRoleFormStore", () => {
	let mockRole: IdentityRoleDto;

	beforeEach(() => {
		// Reset store state before each test
		const store = useRoleFormStore.getState();
		store.closeForm();
		store.setLoading(false);

		mockRole = {
			id: "1",
			name: "Admin",
			isDefault: true,
			isPublic: false,
			isStatic: false,
		};
	});

	it("should have correct initial state", () => {
		const { result } = renderHook(() => useRoleFormStore());

		expect(result.current.role).toBe(null);
		expect(result.current.open).toBe(false);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.error).toBe(null);
	});

	it("should open create form", () => {
		const { result } = renderHook(() => useRoleFormStore());

		act(() => {
			result.current.openCreateForm();
		});

		expect(result.current.open).toBe(true);
		expect(result.current.role).toBe(null);
	});

	it("should open edit form with role", () => {
		const { result } = renderHook(() => useRoleFormStore());

		act(() => {
			result.current.openEditForm(mockRole);
		});

		expect(result.current.open).toBe(true);
		expect(result.current.role).toEqual(mockRole);
	});

	it("should close form and reset role", () => {
		const { result } = renderHook(() => useRoleFormStore());

		// First open edit form
		act(() => {
			result.current.openEditForm(mockRole);
		});

		expect(result.current.open).toBe(true);
		expect(result.current.role).toEqual(mockRole);

		// Then close form
		act(() => {
			result.current.closeForm();
		});

		expect(result.current.open).toBe(false);
		expect(result.current.role).toBe(null);
	});

	it("should set loading state", () => {
		const { result } = renderHook(() => useRoleFormStore());

		act(() => {
			result.current.setLoading(true);
		});

		expect(result.current.isLoading).toBe(true);

		act(() => {
			result.current.setLoading(false);
		});

		expect(result.current.isLoading).toBe(false);
	});

	it("should have role-specific actions", () => {
		const { result } = renderHook(() => useRoleFormStore());

		expect(typeof result.current.openCreateForm).toBe("function");
		expect(typeof result.current.openEditForm).toBe("function");
		expect(typeof result.current.closeForm).toBe("function");
		expect(typeof result.current.setLoading).toBe("function");
	});

	it("should handle form state transitions", () => {
		const { result } = renderHook(() => useRoleFormStore());

		// Start with closed form
		expect(result.current.open).toBe(false);
		expect(result.current.role).toBe(null);

		// Open create form
		act(() => {
			result.current.openCreateForm();
		});
		expect(result.current.open).toBe(true);
		expect(result.current.role).toBe(null);

		// Close form
		act(() => {
			result.current.closeForm();
		});
		expect(result.current.open).toBe(false);
		expect(result.current.role).toBe(null);

		// Open edit form
		act(() => {
			result.current.openEditForm(mockRole);
		});
		expect(result.current.open).toBe(true);
		expect(result.current.role).toEqual(mockRole);

		// Close form again
		act(() => {
			result.current.closeForm();
		});
		expect(result.current.open).toBe(false);
		expect(result.current.role).toBe(null);
	});

	it("should maintain loading state independently of form open state", () => {
		const { result } = renderHook(() => useRoleFormStore());

		// Open form and set loading
		act(() => {
			result.current.openCreateForm();
			result.current.setLoading(true);
		});

		expect(result.current.open).toBe(true);
		expect(result.current.isLoading).toBe(true);

		// Close form but keep loading
		act(() => {
			result.current.closeForm();
		});

		expect(result.current.open).toBe(false);
		expect(result.current.isLoading).toBe(true);

		// Stop loading
		act(() => {
			result.current.setLoading(false);
		});

		expect(result.current.isLoading).toBe(false);
	});
});
