import { create } from "zustand";
import type { TenantDto } from "@/infrastructure/api/types.gen";
import {
	type BaseModalStore,
	createInitialModalState,
} from "@/shared/stores/base-modal-store";

interface TenantConnectionState {
	tenant: TenantDto | null;
	connectionString: string;
}

interface TenantConnectionActions {
	setConnectionString: (connectionString: string) => void;
}

type TenantConnectionStore = BaseModalStore<TenantDto> &
	TenantConnectionState &
	TenantConnectionActions;

const initialState = {
	...createInitialModalState<TenantDto>(),
	tenant: null,
	connectionString: "",
};

export const useTenantConnectionStore = create<TenantConnectionStore>(
	(set) => ({
		...initialState,

		// Base modal actions
		openModal: (tenant?: TenantDto, connectionString = "") => {
			set({
				open: true,
				error: null,
				tenant: tenant || null,
				connectionString: connectionString || "",
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
				tenant: null,
				connectionString: "",
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

		// Tenant connection-specific actions
		setConnectionString: (connectionString: string) =>
			set({ connectionString }),
	}),
);

// Alias for consistency with other modal stores
export const useTenantConnectionModalStore = useTenantConnectionStore;
