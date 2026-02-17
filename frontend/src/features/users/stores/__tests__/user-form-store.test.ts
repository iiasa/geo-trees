import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useUserFormStore } from "../user-form-store";
import type { IdentityUserDto } from "@/infrastructure/api/types.gen";

describe("useUserFormStore", () => {
	let mockUser: IdentityUserDto;

	beforeEach(() => {
		// Reset store state before each test
		const store = useUserFormStore.getState();
		store.closeForm();
		store.setLoading(false);

		mockUser = {
			id: "1",
			userName: "testuser",
			email: "test@example.com",
			name: "Test",
			surname: "User",
		};
	});

	it("should have correct initial state", () => {
		const { result } = renderHook(() => useUserFormStore());

		expect(result.current.user).toBe(null);
		expect(result.current.open).toBe(false);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.error).toBe(null);
		expect(result.current.selectedRoles).toEqual([]);
	});

	it("should open create form", () => {
		const { result } = renderHook(() => useUserFormStore());

		act(() => {
			result.current.openCreateForm();
		});

		expect(result.current.open).toBe(true);
		expect(result.current.user).toBe(null);
	});

	it("should open edit form with user", () => {
		const { result } = renderHook(() => useUserFormStore());

		act(() => {
			result.current.openEditForm(mockUser);
		});

		expect(result.current.open).toBe(true);
		expect(result.current.user).toEqual(mockUser);
	});

	it("should close form and reset user", () => {
		const { result } = renderHook(() => useUserFormStore());

		// First open edit form
		act(() => {
			result.current.openEditForm(mockUser);
		});

		expect(result.current.open).toBe(true);
		expect(result.current.user).toEqual(mockUser);

		// Then close form
		act(() => {
			result.current.closeForm();
		});

		expect(result.current.open).toBe(false);
		expect(result.current.user).toBe(null);
	});

	it("should set loading state", () => {
		const { result } = renderHook(() => useUserFormStore());

		act(() => {
			result.current.setLoading(true);
		});

		expect(result.current.isLoading).toBe(true);

		act(() => {
			result.current.setLoading(false);
		});

		expect(result.current.isLoading).toBe(false);
	});

	it("should set selected roles", () => {
		const { result } = renderHook(() => useUserFormStore());
		const roles = ["admin", "user", "editor"];

		act(() => {
			result.current.setSelectedRoles(roles);
		});

		expect(result.current.selectedRoles).toEqual(roles);
	});

	it("should have user-specific actions", () => {
		const { result } = renderHook(() => useUserFormStore());

		expect(typeof result.current.openCreateForm).toBe("function");
		expect(typeof result.current.openEditForm).toBe("function");
		expect(typeof result.current.closeForm).toBe("function");
		expect(typeof result.current.setSelectedRoles).toBe("function");
		expect(typeof result.current.setLoading).toBe("function");
	});

	it("should handle form state transitions", () => {
		const { result } = renderHook(() => useUserFormStore());

		// Start with closed form
		expect(result.current.open).toBe(false);
		expect(result.current.user).toBe(null);

		// Open create form
		act(() => {
			result.current.openCreateForm();
		});
		expect(result.current.open).toBe(true);
		expect(result.current.user).toBe(null);

		// Close form
		act(() => {
			result.current.closeForm();
		});
		expect(result.current.open).toBe(false);
		expect(result.current.user).toBe(null);

		// Open edit form
		act(() => {
			result.current.openEditForm(mockUser);
		});
		expect(result.current.open).toBe(true);
		expect(result.current.user).toEqual(mockUser);

		// Close form again
		act(() => {
			result.current.closeForm();
		});
		expect(result.current.open).toBe(false);
		expect(result.current.user).toBe(null);
	});
});
