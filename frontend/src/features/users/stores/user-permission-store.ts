import { create } from "zustand";
import type {
	IdentityUserDto,
	PermissionGrantInfoDto,
	PermissionGroupDto,
} from "@/infrastructure/api/types.gen";
import { filterPermissions } from "../../roles/hooks/permission-utils";
import {
	type BaseModalStore,
	createInitialModalState,
} from "@/shared/stores/base-modal-store";

interface UserPermissionModalState {
	// Data state
	user: IdentityUserDto | null;
	allPermissions: PermissionGrantInfoDto[];
	userPermissions: PermissionGrantInfoDto[];
	filteredPermissions: PermissionGrantInfoDto[];
	searchTerm: string;
	apiGroups: PermissionGroupDto[];
	groupNameToPermissionsMap: Record<string, string[]>;
}

interface UserPermissionModalActions {
	// Actions
	setAllPermissions: (permissions: PermissionGrantInfoDto[]) => void;
	setUserPermissions: (permissions: PermissionGrantInfoDto[]) => void;
	setSearchTerm: (term: string) => void;
	updatePermission: (permissionName: string, isGranted: boolean) => void;
	updateGroupPermissions: (groupName: string, isGranted: boolean) => void;
	setApiGroups: (groups: PermissionGroupDto[]) => void;
}

type UserPermissionModalStore = BaseModalStore<IdentityUserDto> &
	UserPermissionModalState &
	UserPermissionModalActions;

const initialState = {
	...createInitialModalState<IdentityUserDto>(),
	user: null,
	allPermissions: [],
	userPermissions: [],
	filteredPermissions: [],
	searchTerm: "",
	apiGroups: [],
	groupNameToPermissionsMap: {},
};

export const useUserPermissionModalStore = create<UserPermissionModalStore>(
	(set, get) => ({
		...initialState,

		// Base modal actions
		openModal: (user?: IdentityUserDto) => {
			set({
				open: true,
				error: null,
				user: user || null,
				isLoading: false,
				isSaving: false,
			});
		},
		closeModal: () => {
			set({
				open: false,
				isLoading: false,
				isSaving: false,
				error: null,
				user: null,
				allPermissions: [],
				userPermissions: [],
				filteredPermissions: [],
				searchTerm: "",
				apiGroups: [],
				groupNameToPermissionsMap: {},
			});
		},
		setLoading: (loading: boolean) => {
			set({ isLoading: loading });
		},
		setSaving: (saving: boolean) => {
			set({ isSaving: saving });
		},
		setError: (error: string | null) => {
			set({ error });
		},
		reset: () => {
			set({
				...initialState,
			});
		},

		// User permission-specific actions
		setAllPermissions: (permissions: PermissionGrantInfoDto[]) => {
			const { userPermissions, searchTerm } = get();

			// Update all permissions with user-specific granted status
			const updatedPermissions = permissions.map((permission) => {
				if (!permission.name) return permission;

				const userPermission = userPermissions.find(
					(up) => up.name === permission.name,
				);

				return {
					...permission,
					isGranted: userPermission?.isGranted || false,
				};
			});

			// Apply search filter if needed
			const filteredPermissions = searchTerm
				? filterPermissions(updatedPermissions, searchTerm)
				: updatedPermissions;

			set({
				allPermissions: updatedPermissions,
				filteredPermissions,
			});
		},

		setUserPermissions: (permissions: PermissionGrantInfoDto[]) => {
			const { allPermissions, searchTerm } = get();

			// Update all permissions with user-specific granted status
			const updatedPermissions = allPermissions.map((permission) => {
				if (!permission.name) return permission;

				const userPermission = permissions.find(
					(up) => up.name === permission.name,
				);

				return {
					...permission,
					isGranted: userPermission?.isGranted || false,
				};
			});

			// Apply search filter if needed
			const filteredPermissions = searchTerm
				? filterPermissions(updatedPermissions, searchTerm)
				: updatedPermissions;

			set({
				userPermissions: permissions,
				allPermissions: updatedPermissions,
				filteredPermissions,
			});
		},

		setSearchTerm: (term: string) => {
			const { allPermissions } = get();

			// Filter permissions based on search term
			const filteredPermissions = term
				? filterPermissions(allPermissions, term)
				: allPermissions;

			set({
				searchTerm: term,
				filteredPermissions,
			});
		},

		updatePermission: (permissionName: string, isGranted: boolean) => {
			const { allPermissions, searchTerm } = get();

			const updatePermissionList = (permissions: PermissionGrantInfoDto[]) =>
				permissions.map((permission) =>
					permission.name === permissionName
						? { ...permission, isGranted }
						: permission,
				);

			const updatedAllPermissions = updatePermissionList(allPermissions);

			// Apply search filter if needed
			const filteredPermissions = searchTerm
				? filterPermissions(updatedAllPermissions, searchTerm)
				: updatedAllPermissions;

			set({
				allPermissions: updatedAllPermissions,
				filteredPermissions,
			});
		},

		setApiGroups: (groups: PermissionGroupDto[]) => {
			// Create a mapping from group display name to permission names
			const map: Record<string, string[]> = {};

			groups.forEach((group) => {
				if (!group.name) return;

				const groupName = group.displayName || group.name;
				map[groupName] = [];

				if (group.permissions) {
					group.permissions.forEach((permission) => {
						if (permission.name) {
							map[groupName].push(permission.name);
						}
					});
				}
			});

			set({
				apiGroups: groups,
				groupNameToPermissionsMap: map,
			});
		},

		updateGroupPermissions: (groupName: string, isGranted: boolean) => {
			const { allPermissions, searchTerm, groupNameToPermissionsMap } = get();

			// Get the permission names that belong to this group
			const groupPermissionNames = groupNameToPermissionsMap[groupName] || [];

			const updatePermissionList = (permissions: PermissionGrantInfoDto[]) =>
				permissions.map((permission) => {
					if (!permission.name) return permission;

					// Check if this permission belongs to the specified group
					if (groupPermissionNames.includes(permission.name)) {
						return { ...permission, isGranted };
					}

					return permission;
				});

			const updatedAllPermissions = updatePermissionList(allPermissions);

			// Apply search filter if needed
			const filteredPermissions = searchTerm
				? filterPermissions(updatedAllPermissions, searchTerm)
				: updatedAllPermissions;

			set({
				allPermissions: updatedAllPermissions,
				filteredPermissions,
			});
		},
	}),
);
