import { describe, it, expect } from "vitest";
import type { PermissionGrantInfoDto } from "@/infrastructure/api/types.gen";
import {
	getPermissionGroupName,
	getPermissionGroupDisplayName,
	getPermissionDisplayName,
	groupPermissions,
	groupPermissionsFromApi,
	filterPermissions,
	convertAppConfigPermissions,
	updatePermissionsWithRoleData,
	convertToUpdatePermissionsDto,
} from "./permission-utils";

describe("Permission Utils", () => {
	describe("getPermissionGroupName", () => {
		it("should extract group name from permission name", () => {
			expect(getPermissionGroupName("AbpIdentity.Users")).toBe("AbpIdentity");
			expect(getPermissionGroupName("CmsKit.Blogs")).toBe("CmsKit");
			expect(getPermissionGroupName("SinglePermission")).toBe("Other");
		});

		it("should handle edge cases", () => {
			expect(getPermissionGroupName("")).toBe("Other");
			expect(getPermissionGroupName("NoDot")).toBe("Other");
		});
	});

	describe("getPermissionGroupDisplayName", () => {
		it("should return display name for known groups", () => {
			expect(getPermissionGroupDisplayName("AbpIdentity")).toBe(
				"Identity Management",
			);
			expect(getPermissionGroupDisplayName("CmsKit")).toBe("CMS Kit");
			expect(getPermissionGroupDisplayName("AbpSaas")).toBe("SaaS");
		});

		it("should return group name for unknown groups", () => {
			expect(getPermissionGroupDisplayName("UnknownGroup")).toBe(
				"UnknownGroup",
			);
			expect(getPermissionGroupDisplayName("")).toBe("");
		});
	});

	describe("getPermissionDisplayName", () => {
		it("should format permission names correctly", () => {
			expect(getPermissionDisplayName("AbpIdentity.Users")).toBe("Users");
			expect(getPermissionDisplayName("AbpIdentity.UserManagement")).toBe(
				"User Management",
			);
			expect(getPermissionDisplayName("CmsKit.BlogManagement.Create")).toBe(
				"Blog Management. Create",
			);
		});

		it("should handle edge cases", () => {
			expect(getPermissionDisplayName("NoDot")).toBe("NoDot");
			expect(getPermissionDisplayName("")).toBe("");
		});
	});

	describe("groupPermissions", () => {
		const mockPermissions: PermissionGrantInfoDto[] = [
			{ name: "AbpIdentity.Users", isGranted: true },
			{ name: "AbpIdentity.Roles", isGranted: false },
			{ name: "CmsKit.Blogs", isGranted: true },
			{ name: "AbpSaas.Tenants", isGranted: false },
		];

		it("should group permissions by category", () => {
			const grouped = groupPermissions(mockPermissions);

			expect(grouped).toHaveProperty("AbpIdentity");
			expect(grouped).toHaveProperty("CmsKit");
			expect(grouped).toHaveProperty("AbpSaas");

			expect(grouped.AbpIdentity).toHaveLength(2);
			expect(grouped.CmsKit).toHaveLength(1);
			expect(grouped.AbpSaas).toHaveLength(1);
		});

		it("should sort permissions within groups", () => {
			const grouped = groupPermissions(mockPermissions);
			expect(grouped.AbpIdentity[0].name).toBe("AbpIdentity.Roles");
			expect(grouped.AbpIdentity[1].name).toBe("AbpIdentity.Users");
		});

		it("should handle empty permissions array", () => {
			const grouped = groupPermissions([]);
			expect(grouped).toEqual({});
		});

		it("should skip permissions without names", () => {
			const permissionsWithNull = [
				...mockPermissions,
				{ name: null, isGranted: true },
				{ name: undefined, isGranted: false },
			];
			const grouped = groupPermissions(permissionsWithNull);
			expect(Object.keys(grouped)).toHaveLength(3); // Same as original
		});
	});

	describe("groupPermissionsFromApi", () => {
		const mockPermissions: PermissionGrantInfoDto[] = [
			{ name: "AbpIdentity.Users", isGranted: true },
			{ name: "CmsKit.Blogs", isGranted: true },
		];

		const mockApiGroups = [
			{
				name: "identity",
				displayName: "Identity Management",
				permissions: [{ name: "AbpIdentity.Users", isGranted: true }],
			},
			{
				name: "cms",
				displayName: "CMS Kit",
				permissions: [{ name: "CmsKit.Blogs", isGranted: true }],
			},
		];

		it("should group permissions based on API groups", () => {
			const grouped = groupPermissionsFromApi(mockPermissions, mockApiGroups);

			expect(grouped).toHaveProperty("Identity Management");
			expect(grouped).toHaveProperty("CMS Kit");

			expect(grouped["Identity Management"]).toHaveLength(1);
			expect(grouped["CMS Kit"]).toHaveLength(1);
		});

		it("should handle groups without displayName", () => {
			const groupsWithoutDisplayName = [
				{
					name: "testGroup",
					permissions: [{ name: "AbpIdentity.Users", isGranted: true }],
				},
			];

			const grouped = groupPermissionsFromApi(
				mockPermissions,
				groupsWithoutDisplayName,
			);
			expect(grouped).toHaveProperty("testGroup");
		});
	});

	describe("filterPermissions", () => {
		const mockPermissions: PermissionGrantInfoDto[] = [
			{ name: "AbpIdentity.Users", isGranted: true },
			{ name: "AbpIdentity.Roles", isGranted: false },
			{ name: "CmsKit.Blogs", isGranted: true },
			{ name: "AbpSaas.Tenants", isGranted: false },
		];

		it("should return all permissions when search term is empty", () => {
			const filtered = filterPermissions(mockPermissions, "");
			expect(filtered).toHaveLength(4);
		});

		it("should filter by permission name", () => {
			const filtered = filterPermissions(mockPermissions, "Users");
			expect(filtered).toHaveLength(1);
			expect(filtered[0].name).toBe("AbpIdentity.Users");
		});

		it("should filter by display name", () => {
			const filtered = filterPermissions(mockPermissions, "Users");
			expect(filtered).toHaveLength(1); // Only Users permission
		});

		it("should filter by group name", () => {
			const filtered = filterPermissions(mockPermissions, "CmsKit");
			expect(filtered).toHaveLength(1);
			expect(filtered[0].name).toBe("CmsKit.Blogs");
		});

		it("should filter by group display name", () => {
			const filtered = filterPermissions(
				mockPermissions,
				"Identity Management",
			);
			expect(filtered).toHaveLength(2);
		});

		it("should be case insensitive", () => {
			const filtered = filterPermissions(mockPermissions, "users");
			expect(filtered).toHaveLength(1);
		});

		it("should skip permissions without names", () => {
			const permissionsWithNull = [
				...mockPermissions,
				{ name: null, isGranted: true },
			];
			const filtered = filterPermissions(permissionsWithNull, "test");
			expect(filtered).toHaveLength(0);
		});
	});

	describe("convertAppConfigPermissions", () => {
		const appConfigPermissions = {
			"AbpIdentity.Users": true,
			"CmsKit.Blogs": false,
		};

		it("should convert app config permissions to PermissionGrantInfoDto format", () => {
			const converted = convertAppConfigPermissions(appConfigPermissions);

			expect(converted).toHaveLength(2);
			expect(converted[0]).toEqual({
				name: "AbpIdentity.Users",
				displayName: "Users",
				parentName: "AbpIdentity",
				isGranted: false,
				allowedProviders: null,
				grantedProviders: null,
			});
		});
	});

	describe("updatePermissionsWithRoleData", () => {
		const allPermissions: PermissionGrantInfoDto[] = [
			{ name: "AbpIdentity.Users", isGranted: false },
			{ name: "CmsKit.Blogs", isGranted: false },
		];

		const rolePermissions: PermissionGrantInfoDto[] = [
			{ name: "AbpIdentity.Users", isGranted: true },
		];

		it("should update permissions with role-specific granted status", () => {
			const updated = updatePermissionsWithRoleData(
				allPermissions,
				rolePermissions,
			);

			expect(updated[0].isGranted).toBe(true); // Updated from role data
			expect(updated[1].isGranted).toBe(false); // No role data, remains false
		});

		it("should handle permissions without names", () => {
			const permissionsWithNull = [
				{ name: null, isGranted: false },
				{ name: "AbpIdentity.Users", isGranted: false },
			];

			const updated = updatePermissionsWithRoleData(
				permissionsWithNull,
				rolePermissions,
			);
			expect(updated[0].isGranted).toBe(false); // Unchanged
			expect(updated[1].isGranted).toBe(true); // Updated
		});
	});

	describe("convertToUpdatePermissionsDto", () => {
		const permissions: PermissionGrantInfoDto[] = [
			{ name: "AbpIdentity.Users", isGranted: true },
			{ name: "CmsKit.Blogs", isGranted: false },
		];

		it("should convert permissions to UpdatePermissionsDto format", () => {
			const converted = convertToUpdatePermissionsDto(permissions);

			expect(converted).toEqual({
				permissions: [
					{ name: "AbpIdentity.Users", isGranted: true },
					{ name: "CmsKit.Blogs", isGranted: false },
				],
			});
		});

		it("should handle permissions with null/undefined values", () => {
			const permissionsWithNulls: PermissionGrantInfoDto[] = [
				{ name: null, isGranted: true },
				{ name: "AbpIdentity.Users", isGranted: undefined },
			];

			const converted = convertToUpdatePermissionsDto(permissionsWithNulls);

			expect(converted.permissions[0]).toEqual({ name: "", isGranted: true });
			expect(converted.permissions[1]).toEqual({
				name: "AbpIdentity.Users",
				isGranted: false,
			});
		});
	});
});
