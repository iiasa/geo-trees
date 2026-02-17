import type { IdentityUserDto } from "@/infrastructure/api/types.gen";
import { create } from "zustand";
import {
	type BaseFormStore,
	createFormStoreActions,
	createInitialFormState,
} from "@/shared/stores/base-store";

interface UserFormActions {
	setLoading: (loading: boolean) => void;
	openCreateForm: () => void;
	openEditForm: (user: IdentityUserDto) => void;
	closeForm: () => void;
	setSelectedRoles: (roles: string[]) => void;
}

type UserFormStore = BaseFormStore<IdentityUserDto> & {
	user: IdentityUserDto | null;
	open: boolean;
	selectedRoles: string[];
} & UserFormActions;

const initialState = {
	...createInitialFormState<IdentityUserDto>(),
	user: null,
	open: false,
	selectedRoles: [],
};

export const useUserFormStore = create<UserFormStore>((set, _get) => ({
	// Initial state
	...initialState,

	// Base form actions
	...createFormStoreActions<IdentityUserDto>(),

	// User-specific actions
	setLoading: (loading: boolean) => set({ isLoading: loading }),
	openCreateForm: () => set({ user: null, open: true }),
	openEditForm: (user: IdentityUserDto) => set({ user, open: true }),
	closeForm: () => set({ user: null, open: false }),
	setSelectedRoles: (roles: string[]) =>
		set({
			selectedRoles: roles,
		}),
}));
