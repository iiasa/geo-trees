import { describe, it, expect } from "vitest";
import type { PermissionGrantInfoDto } from "@/infrastructure/api/types.gen";
import { filterPermissions } from "../../../roles/hooks/permission-utils";

describe("User Permission Utils", () => {
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

		it("should filter by group name", () => {
			const filtered = filterPermissions(mockPermissions, "CmsKit");
			expect(filtered).toHaveLength(1);
			expect(filtered[0].name).toBe("CmsKit.Blogs");
		});

		it("should be case insensitive", () => {
			const filtered = filterPermissions(mockPermissions, "users");
			expect(filtered).toHaveLength(1);
		});

		it("should handle permissions without names", () => {
			const permissionsWithNull = [
				...mockPermissions,
				{ name: null, isGranted: true },
			];
			const filtered = filterPermissions(permissionsWithNull, "test");
			// Should not crash and should filter normally
			expect(filtered).toHaveLength(0);
		});

		it("should return empty array when no matches found", () => {
			const filtered = filterPermissions(mockPermissions, "NonExistent");
			expect(filtered).toHaveLength(0);
		});
	});
});
