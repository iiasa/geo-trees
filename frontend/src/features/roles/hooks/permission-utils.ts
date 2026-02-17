import type { PermissionGrantInfoDto } from "@/infrastructure/api/types.gen";

// Define a simple interface for the permission group
export interface PermissionGroup {
	name: string;
	displayName?: string;
	permissions?: PermissionGrantInfoDto[];
}

// Permission group display names mapping
const PERMISSION_GROUP_DISPLAY_NAMES: Record<string, string> = {
	AbpIdentity: "Identity Management",
	AbpTenantManagement: "Tenant Management",
	AbpOpenIddict: "OpenIddict",
	AbpFeatureManagement: "Feature Management",
	AbpSettingManagement: "Setting Management",
	AbpAuditLogging: "Audit Logging",
	AbpPermissionManagement: "Permission Management",
	AbpIdentityServer: "Identity Server",
	AbpSaas: "SaaS",
	AbpGdpr: "GDPR",
	AbpLanguageManagement: "Language Management",
	AbpTextTemplateManagement: "Text Template Management",
	AbpLeptonTheme: "Lepton Theme",
	CmsKit: "CMS Kit",
	CmsKitPro: "CMS Kit Pro",
};

// Extract group name from permission name
export const getPermissionGroupName = (permissionName: string): string => {
	const parts = permissionName.split(".");
	if (parts.length < 2) return "Other";
	return parts[0];
};

// Get display name for a permission group
export const getPermissionGroupDisplayName = (groupName: string): string => {
	return PERMISSION_GROUP_DISPLAY_NAMES[groupName] || groupName;
};

// Get display name for a permission
export const getPermissionDisplayName = (permissionName: string): string => {
	const parts = permissionName.split(".");
	if (parts.length < 2) return permissionName;

	// Remove the group prefix and format the rest
	const permissionPart = parts.slice(1).join(".");

	// Convert camelCase to Title Case with spaces
	return permissionPart
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, (str) => str.toUpperCase())
		.trim();
};

// Group permissions by their category
export const groupPermissions = (
	permissions: PermissionGrantInfoDto[],
): Record<string, PermissionGrantInfoDto[]> => {
	const grouped: Record<string, PermissionGrantInfoDto[]> = {};

	permissions.forEach((permission) => {
		if (!permission.name) return;

		const groupName = getPermissionGroupName(permission.name);
		if (!grouped[groupName]) {
			grouped[groupName] = [];
		}
		grouped[groupName].push(permission);
	});

	// Sort permissions within each group
	Object.keys(grouped).forEach((groupName) => {
		grouped[groupName].sort((a, b) => {
			if (!a.name || !b.name) return 0;
			return a.name.localeCompare(b.name);
		});
	});

	return grouped;
};

// Group permissions based on API response groups
export const groupPermissionsFromApi = (
	permissions: PermissionGrantInfoDto[],
	apiGroups: PermissionGroup[], // Use the PermissionGroup interface instead of 'any'
): Record<string, PermissionGrantInfoDto[]> => {
	const grouped: Record<string, PermissionGrantInfoDto[]> = {};
	const permissionMap = new Map<string, PermissionGrantInfoDto>();

	// Create a map of permission names to permission objects for quick lookup
	permissions.forEach((permission) => {
		if (permission.name) {
			permissionMap.set(permission.name, permission);
		}
	});

	// Group permissions based on API groups
	apiGroups.forEach((group) => {
		// Use displayName or fallback to a default name if group name is null/undefined
		const groupName = group.displayName || group.name || "Unnamed Group";
		grouped[groupName] = [];

		if (group.permissions) {
			group.permissions.forEach((permission) => {
				if (permission.name && permissionMap.has(permission.name)) {
					// Use the permission from our filtered list to maintain search filter state
					const filteredPermission = permissionMap.get(permission.name);
					if (filteredPermission) {
						grouped[groupName].push(filteredPermission);
					}
				}
			});
		}
	});

	// Sort permissions within each group
	Object.keys(grouped).forEach((groupName) => {
		grouped[groupName].sort((a, b) => {
			if (!a.name || !b.name) return 0;
			return a.name.localeCompare(b.name);
		});
	});

	return grouped;
};

// Filter permissions based on search term
export const filterPermissions = (
	permissions: PermissionGrantInfoDto[],
	searchTerm: string,
): PermissionGrantInfoDto[] => {
	if (!searchTerm.trim()) return permissions;

	const lowerSearchTerm = searchTerm.toLowerCase();
	return permissions.filter((permission) => {
		if (!permission.name) return false;

		const displayName = getPermissionDisplayName(permission.name);
		const groupName = getPermissionGroupName(permission.name);
		const groupDisplayName = getPermissionGroupDisplayName(groupName);

		return (
			permission.name.toLowerCase().includes(lowerSearchTerm) ||
			displayName.toLowerCase().includes(lowerSearchTerm) ||
			groupName.toLowerCase().includes(lowerSearchTerm) ||
			groupDisplayName.toLowerCase().includes(lowerSearchTerm)
		);
	});
};

// Convert application configuration permissions to PermissionGrantInfoDto format
export const convertAppConfigPermissions = (
	appConfigPermissions: Record<string, boolean>,
): PermissionGrantInfoDto[] => {
	return Object.entries(appConfigPermissions).map(([name]) => ({
		name,
		displayName: getPermissionDisplayName(name),
		parentName: getPermissionGroupName(name),
		isGranted: false, // Default to false, will be updated with role permissions
		allowedProviders: null,
		grantedProviders: null,
	}));
};

// Update permissions with role-specific granted status
export const updatePermissionsWithRoleData = (
	allPermissions: PermissionGrantInfoDto[],
	rolePermissions: PermissionGrantInfoDto[],
): PermissionGrantInfoDto[] => {
	const rolePermissionMap = new Map<string, boolean>();

	// Create a map of permission names to their granted status
	rolePermissions.forEach((permission) => {
		if (permission.name && permission.isGranted !== undefined) {
			rolePermissionMap.set(permission.name, permission.isGranted);
		}
	});

	// Update all permissions with role-specific granted status
	return allPermissions.map((permission) => {
		if (!permission.name) return permission;

		return {
			...permission,
			isGranted: rolePermissionMap.get(permission.name) || false,
		};
	});
};

// Convert permissions to UpdatePermissionsDto format for API
export const convertToUpdatePermissionsDto = (
	permissions: PermissionGrantInfoDto[],
) => {
	return {
		permissions: permissions.map((permission) => ({
			name: permission.name || "",
			isGranted: permission.isGranted || false,
		})),
	};
};
