import { create } from "zustand";
import type { TenantDto } from "@/infrastructure/api/types.gen";
import {
	type BaseFormStore,
	createFormStoreActions,
	createInitialFormState,
} from "@/shared/stores/base-store";

interface TenantFormData {
	name: string;
	adminEmailAddress?: string;
	adminPassword?: string;
	isActive?: boolean;
}

interface TenantFormState {
	tenant: TenantDto | null;
	open: boolean;
	formData: TenantFormData;
}

interface TenantFormActions {
	setLoading: (loading: boolean) => void;
	openCreateForm: () => void;
	openEditForm: (tenant: TenantDto) => void;
	closeForm: () => void;
	updateFormData: (data: Partial<TenantFormData>) => void;
	resetForm: () => void;
}

type TenantFormStore = BaseFormStore<TenantDto> &
	TenantFormState &
	TenantFormActions;

const initialFormData: TenantFormData = {
	name: "",
	adminEmailAddress: "",
	adminPassword: "",
	isActive: true,
};

const initialState = {
	...createInitialFormState<TenantDto>(),
	tenant: null,
	open: false,
	formData: { ...initialFormData },
};

export const useTenantFormStore = create<TenantFormStore>((set, _get) => ({
	// Initial state
	...initialState,

	// Base form actions
	...createFormStoreActions<TenantDto>(),

	// Tenant-specific actions
	setLoading: (loading: boolean) => set({ isLoading: loading }),
	openCreateForm: () => set({ tenant: null, open: true }),
	openEditForm: (tenant: TenantDto) => set({ tenant, open: true }),
	closeForm: () => set({ tenant: null, open: false }),
	updateFormData: (data) =>
		set((state) => ({
			formData: { ...state.formData, ...data },
		})),

	resetForm: () =>
		set({
			formData: { ...initialFormData },
		}),
}));
