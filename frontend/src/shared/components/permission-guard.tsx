import type { ReactNode } from "react";
import { usePermissions } from "../hooks/use-permissions";

/**
 * Permission guard component to conditionally render children based on permissions
 *
 * @example
 * ```tsx
 * <PermissionGuard permission="CmsKit.Pages.Update">
 *   <EditButton />
 * </PermissionGuard>
 *
 * <PermissionGuard anyOf={["CmsKit.Pages.Create", "CmsKit.Pages.Update"]}>
 *   <PageActions />
 * </PermissionGuard>
 *
 * <PermissionGuard
 *   allOf={["CmsKit.Pages.Delete", "CmsKit.Pages.Update"]}
 *   fallback={<span>No permission</span>}
 * >
 *   <DangerousActions />
 * </PermissionGuard>
 * ```
 */
export function PermissionGuard({
	permission,
	anyOf,
	allOf,
	fallback = null,
	children,
}: {
	/** Single permission to check */
	permission?: string;
	/** Check if user has any of these permissions */
	anyOf?: string[];
	/** Check if user has all of these permissions */
	allOf?: string[];
	/** Fallback to render when permission check fails */
	fallback?: ReactNode;
	children: ReactNode;
}) {
	const { hasPermission, hasAnyPermission, hasAllPermissions, isLoading } =
		usePermissions();

	// While loading, don't render anything to prevent flashing
	if (isLoading) {
		return null;
	}

	let hasAccess = false;

	if (permission) {
		hasAccess = hasPermission(permission);
	} else if (anyOf && anyOf.length > 0) {
		hasAccess = hasAnyPermission(anyOf);
	} else if (allOf && allOf.length > 0) {
		hasAccess = hasAllPermissions(allOf);
	}

	return hasAccess ? children : fallback;
}
