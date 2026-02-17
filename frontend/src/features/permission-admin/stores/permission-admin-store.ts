import { create } from "zustand";
import type {
	PermissionGrantInfoDto,
	PermissionGroupDto,
} from "@/infrastructure/api/types.gen";
import { filterPermissions } from "@/features/roles/hooks/permission-utils";

type PermissionAdminState = {
	permissions: PermissionGrantInfoDto[];
	filteredPermissions: PermissionGrantInfoDto[];
	groups: PermissionGroupDto[];
	groupPermissionMap: Record<string, string[]>;
	searchTerm: string;
};

type PermissionAdminActions = {
	setFromApi: (groups: PermissionGroupDto[]) => void;
	setSearchTerm: (term: string) => void;
	updatePermission: (name: string, isGranted: boolean) => void;
	updateGroup: (groupName: string, isGranted: boolean) => void;
	reset: () => void;
};

type PermissionAdminStore = PermissionAdminState & PermissionAdminActions;

const initialState: PermissionAdminState = {
	permissions: [],
	filteredPermissions: [],
	groups: [],
	groupPermissionMap: {},
	searchTerm: "",
};

export const usePermissionAdminStore = create<PermissionAdminStore>(
	(set, get) => ({
		...initialState,
		setFromApi: (groups) => {
			const permissions: PermissionGrantInfoDto[] = [];
			const map: Record<string, string[]> = {};

			groups.forEach((group) => {
				if (!group.name && !group.displayName) return;
				const displayName = group.displayName || group.name || "Unnamed Group";
				map[displayName] = [];
				group.permissions?.forEach((permission) => {
					if (!permission.name) return;
					permissions.push(permission);
					map[displayName].push(permission.name);
				});
			});

			set({
				groups,
				permissions,
				filteredPermissions: filterPermissions(permissions, get().searchTerm),
				groupPermissionMap: map,
			});
		},
		setSearchTerm: (term) => {
			const { permissions } = get();
			set({
				searchTerm: term,
				filteredPermissions: filterPermissions(permissions, term),
			});
		},
		updatePermission: (name, isGranted) => {
			const { permissions, searchTerm } = get();
			const updated = permissions.map((permission) =>
				permission.name === name ? { ...permission, isGranted } : permission,
			);
			set({
				permissions: updated,
				filteredPermissions: filterPermissions(updated, searchTerm),
			});
		},
		updateGroup: (groupName, isGranted) => {
			const { groupPermissionMap, permissions, searchTerm } = get();
			const names = new Set(groupPermissionMap[groupName] || []);
			const updated = permissions.map((permission) =>
				permission.name && names.has(permission.name)
					? { ...permission, isGranted }
					: permission,
			);
			set({
				permissions: updated,
				filteredPermissions: filterPermissions(updated, searchTerm),
			});
		},
		reset: () => set(initialState),
	}),
);
