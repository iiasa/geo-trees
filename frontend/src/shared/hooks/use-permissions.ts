import { useQuery } from "@tanstack/react-query";
import { abpApplicationConfigurationGetOptions } from "@/infrastructure/api/@tanstack/react-query.gen";

/**
 * Hook to check user permissions using ABP's application configuration
 *
 * @example
 * ```tsx
 * const { hasPermission, hasAnyPermission, hasAllPermissions, isLoading } = usePermissions();
 *
 * // Check single permission
 * if (hasPermission("CmsKit.Pages.Update")) {
 *   return <EditButton />;
 * }
 *
 * // Check multiple permissions (any)
 * if (hasAnyPermission(["CmsKit.Pages.Create", "CmsKit.Pages.Update"])) {
 *   return <PageActions />;
 * }
 *
 * // Check multiple permissions (all)
 * if (hasAllPermissions(["CmsKit.Pages.Delete", "CmsKit.Pages.Update"])) {
 *   return <DangerousActions />;
 * }
 * ```
 */
export function usePermissions() {
	const { data: appConfig, isLoading } = useQuery(
		abpApplicationConfigurationGetOptions(),
	);

	const grantedPolicies = appConfig?.auth?.grantedPolicies ?? {};

	/**
	 * Check if the current user has a specific permission
	 * @param permissionName - The permission name to check (e.g., "CmsKit.Pages.Update")
	 * @returns true if the user has the permission, false otherwise
	 */
	const hasPermission = (permissionName: string): boolean => {
		return grantedPolicies[permissionName] === true;
	};

	/**
	 * Check if the current user has any of the specified permissions
	 * @param permissionNames - Array of permission names to check
	 * @returns true if the user has at least one of the permissions, false otherwise
	 */
	const hasAnyPermission = (permissionNames: string[]): boolean => {
		return permissionNames.some((permission) => hasPermission(permission));
	};

	/**
	 * Check if the current user has all of the specified permissions
	 * @param permissionNames - Array of permission names to check
	 * @returns true if the user has all of the permissions, false otherwise
	 */
	const hasAllPermissions = (permissionNames: string[]): boolean => {
		return permissionNames.every((permission) => hasPermission(permission));
	};

	/**
	 * Get all granted permissions for the current user
	 * @returns Array of permission names that are granted
	 */
	const getGrantedPermissions = (): string[] => {
		return Object.entries(grantedPolicies)
			.filter(([, isGranted]) => isGranted === true)
			.map(([permissionName]) => permissionName);
	};

	return {
		hasPermission,
		hasAnyPermission,
		hasAllPermissions,
		getGrantedPermissions,
		isLoading,
		/** All granted policies from the application configuration */
		grantedPolicies,
	};
}

/**
 * CMS-specific permission names
 * Use these constants to avoid typos and improve autocomplete
 */
export const CMS_PERMISSIONS = {
	// Pages
	PAGES_CREATE: "CmsKit.Pages.Create",
	PAGES_UPDATE: "CmsKit.Pages.Update",
	PAGES_DELETE: "CmsKit.Pages.Delete",
	PAGES_SET_HOME: "CmsKit.Pages.SetAsHomePage",

	// Menu Items
	MENU_ITEMS_CREATE: "CmsKit.MenuItems.Create",
	MENU_ITEMS_UPDATE: "CmsKit.MenuItems.Update",
	MENU_ITEMS_DELETE: "CmsKit.MenuItems.Delete",

	// Comments
	COMMENTS_CREATE: "CmsKit.Comments.Create",
	COMMENTS_UPDATE: "CmsKit.Comments.Update",
	COMMENTS_DELETE: "CmsKit.Comments.Delete",
	COMMENTS_MODERATE: "CmsKit.Comments.Moderate",
} as const;
