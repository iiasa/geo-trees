import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useUserPermissionModalStore } from "../user-permission-store";
import type {
	IdentityUserDto,
	PermissionGrantInfoDto,
	PermissionGroupDto,
} from "@/infrastructure/api/types.gen";

describe("useUserPermissionModalStore", () => {
	let mockUser: IdentityUserDto;
	let mockPermissions: PermissionGrantInfoDto[];
	let mockGroups: PermissionGroupDto[];

	beforeEach(() => {
		// Reset store state before each test
		const store = useUserPermissionModalStore.getState();
		store.closeModal();
		store.setLoading(false);
		store.setSaving(false);
		store.setError(null);

		mockUser = {
			id: "1",
			userName: "testuser",
			email: "test@example.com",
			name: "Test",
			surname: "User",
		};

		mockPermissions = [
			{
				name: "AbpIdentity.Users",
				isGranted: false,
			},
			{
				name: "AbpIdentity.Roles",
				isGranted: true,
			},
			{
				name: "CmsKit.Blogs",
				isGranted: false,
			},
		];

		mockGroups = [
			{
				name: "identity",
				displayName: "Identity Management",
				permissions: [
					{ name: "AbpIdentity.Users", isGranted: false },
					{ name: "AbpIdentity.Roles", isGranted: false },
				],
			},
			{
				name: "cms",
				displayName: "CMS Kit",
				permissions: [{ name: "CmsKit.Blogs", isGranted: false }],
			},
		];
	});

	it("should have correct initial state", () => {
		const { result } = renderHook(() => useUserPermissionModalStore());

		expect(result.current.user).toBe(null);
		expect(result.current.open).toBe(false);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isSaving).toBe(false);
		expect(result.current.error).toBe(null);
		expect(result.current.allPermissions).toEqual([]);
		expect(result.current.userPermissions).toEqual([]);
		expect(result.current.filteredPermissions).toEqual([]);
		expect(result.current.searchTerm).toBe("");
		expect(result.current.apiGroups).toEqual([]);
		expect(result.current.groupNameToPermissionsMap).toEqual({});
	});

	it("should open modal with user", () => {
		const { result } = renderHook(() => useUserPermissionModalStore());

		act(() => {
			result.current.openModal(mockUser);
		});

		expect(result.current.open).toBe(true);
		expect(result.current.user).toEqual(mockUser);
	});

	it("should close modal and reset state", () => {
		const { result } = renderHook(() => useUserPermissionModalStore());

		// First open modal
		act(() => {
			result.current.openModal(mockUser);
		});

		expect(result.current.open).toBe(true);
		expect(result.current.user).toEqual(mockUser);

		// Then close modal
		act(() => {
			result.current.closeModal();
		});

		expect(result.current.open).toBe(false);
		expect(result.current.user).toBe(null);
		expect(result.current.allPermissions).toEqual([]);
		expect(result.current.searchTerm).toBe("");
	});

	it("should set loading state", () => {
		const { result } = renderHook(() => useUserPermissionModalStore());

		act(() => {
			result.current.setLoading(true);
		});

		expect(result.current.isLoading).toBe(true);

		act(() => {
			result.current.setLoading(false);
		});

		expect(result.current.isLoading).toBe(false);
	});

	it("should set saving state", () => {
		const { result } = renderHook(() => useUserPermissionModalStore());

		act(() => {
			result.current.setSaving(true);
		});

		expect(result.current.isSaving).toBe(true);

		act(() => {
			result.current.setSaving(false);
		});

		expect(result.current.isSaving).toBe(false);
	});

	it("should set error state", () => {
		const { result } = renderHook(() => useUserPermissionModalStore());

		act(() => {
			result.current.setError("Test error");
		});

		expect(result.current.error).toBe("Test error");

		act(() => {
			result.current.setError(null);
		});

		expect(result.current.error).toBe(null);
	});

	it("should set all permissions and update with user permissions", () => {
		const { result } = renderHook(() => useUserPermissionModalStore());

		// First set user permissions to match our mock data
		act(() => {
			result.current.setUserPermissions([
				{
					name: "AbpIdentity.Roles",
					isGranted: true,
				},
			]);
			result.current.setAllPermissions(mockPermissions);
		});

		// The permissions should be updated with user-specific granted status
		const usersPermission = result.current.allPermissions.find(
			(p: PermissionGrantInfoDto) => p.name === "AbpIdentity.Users",
		);
		const rolesPermission = result.current.allPermissions.find(
			(p: PermissionGrantInfoDto) => p.name === "AbpIdentity.Roles",
		);
		const blogsPermission = result.current.allPermissions.find(
			(p: PermissionGrantInfoDto) => p.name === "CmsKit.Blogs",
		);

		expect(usersPermission?.isGranted).toBe(false);
		expect(rolesPermission?.isGranted).toBe(true);
		expect(blogsPermission?.isGranted).toBe(false);

		// filteredPermissions will be the same as allPermissions when no search term is set
		expect(result.current.filteredPermissions.length).toBe(3);
	});

	it("should set user permissions and update all permissions", () => {
		const { result } = renderHook(() => useUserPermissionModalStore());
		const userPermissions = [
			{
				name: "AbpIdentity.Users",
				isGranted: true,
			},
			{
				name: "AbpIdentity.Roles",
				isGranted: true,
			},
		];

		act(() => {
			result.current.setAllPermissions(mockPermissions);
			result.current.setUserPermissions(userPermissions);
		});

		const usersPermission = result.current.allPermissions.find(
			(p: PermissionGrantInfoDto) => p.name === "AbpIdentity.Users",
		);
		const rolesPermission = result.current.allPermissions.find(
			(p: PermissionGrantInfoDto) => p.name === "AbpIdentity.Roles",
		);
		const blogsPermission = result.current.allPermissions.find(
			(p: PermissionGrantInfoDto) => p.name === "CmsKit.Blogs",
		);

		expect(usersPermission?.isGranted).toBe(true); // Should be updated
		expect(rolesPermission?.isGranted).toBe(true); // Should remain true
		expect(blogsPermission?.isGranted).toBe(false); // Should remain unchanged
	});

	it("should set search term and filter permissions", () => {
		const { result } = renderHook(() => useUserPermissionModalStore());

		act(() => {
			result.current.setAllPermissions(mockPermissions);
			result.current.setSearchTerm("Users");
		});

		expect(result.current.searchTerm).toBe("Users");
		// Note: Actual filtering logic is in filterPermissions utility function
		// We're just testing that the searchTerm is set
	});

	it("should update a single permission", () => {
		const { result } = renderHook(() => useUserPermissionModalStore());

		// First set user permissions to match our mock data
		act(() => {
			result.current.setUserPermissions([
				{
					name: "AbpIdentity.Roles",
					isGranted: true,
				},
			]);
			result.current.setAllPermissions(mockPermissions);
			result.current.updatePermission("AbpIdentity.Users", true);
		});

		// Find the updated permission by name
		const updatedPermission = result.current.allPermissions.find(
			(p: PermissionGrantInfoDto) => p.name === "AbpIdentity.Users",
		);
		const unchangedPermission1 = result.current.allPermissions.find(
			(p: PermissionGrantInfoDto) => p.name === "AbpIdentity.Roles",
		);
		const unchangedPermission2 = result.current.allPermissions.find(
			(p: PermissionGrantInfoDto) => p.name === "CmsKit.Blogs",
		);

		expect(updatedPermission?.isGranted).toBe(true);
		expect(unchangedPermission1?.isGranted).toBe(true); // Should remain unchanged
		expect(unchangedPermission2?.isGranted).toBe(false); // Should remain unchanged
	});

	it("should set API groups and create mapping", () => {
		const { result } = renderHook(() => useUserPermissionModalStore());

		act(() => {
			result.current.setApiGroups(mockGroups);
		});

		expect(result.current.apiGroups).toEqual(mockGroups);
		expect(result.current.groupNameToPermissionsMap).toEqual({
			"Identity Management": ["AbpIdentity.Users", "AbpIdentity.Roles"],
			"CMS Kit": ["CmsKit.Blogs"],
		});
	});

	it("should update group permissions", () => {
		const { result } = renderHook(() => useUserPermissionModalStore());

		act(() => {
			result.current.setAllPermissions(mockPermissions);
			result.current.setApiGroups(mockGroups);
			result.current.updateGroupPermissions("Identity Management", true);
		});

		const usersPermission = result.current.allPermissions.find(
			(p: PermissionGrantInfoDto) => p.name === "AbpIdentity.Users",
		);
		const rolesPermission = result.current.allPermissions.find(
			(p: PermissionGrantInfoDto) => p.name === "AbpIdentity.Roles",
		);
		const blogsPermission = result.current.allPermissions.find(
			(p: PermissionGrantInfoDto) => p.name === "CmsKit.Blogs",
		);

		expect(usersPermission?.isGranted).toBe(true); // Should be updated
		expect(rolesPermission?.isGranted).toBe(true); // Should be updated
		expect(blogsPermission?.isGranted).toBe(false); // Should remain unchanged
	});

	it("should reset to initial state", () => {
		const { result } = renderHook(() => useUserPermissionModalStore());

		// Modify state
		act(() => {
			result.current.openModal(mockUser);
			result.current.setLoading(true);
			result.current.setSaving(true);
		});

		expect(result.current.open).toBe(true);
		expect(result.current.user).toEqual(mockUser);
		expect(result.current.isLoading).toBe(true);
		expect(result.current.isSaving).toBe(true);

		// Reset state
		act(() => {
			result.current.reset();
		});

		expect(result.current.open).toBe(false);
		expect(result.current.user).toBe(null);
		expect(result.current.allPermissions).toEqual([]);
		expect(result.current.searchTerm).toBe("");
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isSaving).toBe(false);
		expect(result.current.error).toBe(null);
	});

	it("should have base modal actions", () => {
		const { result } = renderHook(() => useUserPermissionModalStore());

		expect(typeof result.current.openModal).toBe("function");
		expect(typeof result.current.closeModal).toBe("function");
		expect(typeof result.current.setLoading).toBe("function");
		expect(typeof result.current.setSaving).toBe("function");
		expect(typeof result.current.setError).toBe("function");
		expect(typeof result.current.reset).toBe("function");
	});

	it("should have user permission-specific actions", () => {
		const { result } = renderHook(() => useUserPermissionModalStore());

		expect(typeof result.current.setAllPermissions).toBe("function");
		expect(typeof result.current.setUserPermissions).toBe("function");
		expect(typeof result.current.setSearchTerm).toBe("function");
		expect(typeof result.current.updatePermission).toBe("function");
		expect(typeof result.current.updateGroupPermissions).toBe("function");
		expect(typeof result.current.setApiGroups).toBe("function");
	});
});
