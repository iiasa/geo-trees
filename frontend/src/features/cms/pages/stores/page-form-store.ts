import { create } from "zustand";
import type { VoloCmsKitAdminPagesPageDto } from "@/infrastructure/api/types.gen";
import {
	type BaseFormStore,
	createFormStoreActions,
	createInitialFormState,
} from "@/shared/stores/base-store";

interface PageFormActions {
	setLoading: (loading: boolean) => void;
	openCreateForm: () => void;
	openEditForm: (page: VoloCmsKitAdminPagesPageDto) => void;
	closeForm: () => void;
}

type PageFormStore = BaseFormStore<VoloCmsKitAdminPagesPageDto> & {
	page: VoloCmsKitAdminPagesPageDto | null;
	open: boolean;
} & PageFormActions;

const initialState = {
	...createInitialFormState<VoloCmsKitAdminPagesPageDto>(),
	page: null,
	open: false,
};

export const usePageFormStore = create<PageFormStore>((set, _get) => ({
	// Initial state
	...initialState,

	// Base form actions
	...createFormStoreActions<VoloCmsKitAdminPagesPageDto>(),

	// Page-specific actions
	setLoading: (loading: boolean) => set({ isLoading: loading }),
	openCreateForm: () => set({ page: null, open: true }),
	openEditForm: (page: VoloCmsKitAdminPagesPageDto) =>
		set({ page, open: true }),
	closeForm: () => set({ page: null, open: false }),
}));
