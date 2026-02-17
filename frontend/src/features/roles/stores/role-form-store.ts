import { create } from "zustand";
import type { IdentityRoleDto } from "@/infrastructure/api/types.gen";
import {
	type BaseFormStore,
	createFormStoreActions,
	createInitialFormState,
} from "@/shared/stores/base-store";

interface RoleFormState {
	role: IdentityRoleDto | null;
	open: boolean;
}

interface RoleFormActions {
	setLoading: (loading: boolean) => void;
	openCreateForm: () => void;
	openEditForm: (role: IdentityRoleDto) => void;
	closeForm: () => void;
}

type RoleFormStore = BaseFormStore<IdentityRoleDto> &
	RoleFormState &
	RoleFormActions;

const initialState = createInitialFormState<IdentityRoleDto>();

export const useRoleFormStore = create<RoleFormStore>((set, _get) => ({
	// Initial state
	...initialState,
	role: null,
	open: false,

	// Base form actions
	...createFormStoreActions<IdentityRoleDto>(),

	// Role-specific actions
	setLoading: (loading: boolean) => set({ isLoading: loading }),
	openCreateForm: () => set({ role: null, open: true }),
	openEditForm: (role: IdentityRoleDto) => set({ role, open: true }),
	closeForm: () => set({ role: null, open: false }),
}));
