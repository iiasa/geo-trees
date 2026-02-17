import { create } from "zustand";

export type BaseModalStore<TData = void> = BaseModalState &
	BaseModalActions<TData>;

interface BaseModalState {
	open: boolean;
	isLoading: boolean;
	isSaving: boolean;
	error: string | null;
}

interface BaseModalActions<TData> {
	openModal: (data?: TData) => void;
	closeModal: () => void;
	setLoading: (loading: boolean) => void;
	setSaving: (saving: boolean) => void;
	setError: (error: string | null) => void;
	reset: () => void;
}

export const createModalStoreActions = <_TData>() => ({
	// Default actions can be added here if needed
});

export const createInitialModalState = <_TData = void>(): BaseModalState => ({
	open: false,
	isLoading: false,
	isSaving: false,
	error: null,
});

export const createBaseModalStore = <
	TState extends object,
	TActions extends object,
	TData = void,
>(
	initialState: TState,
	createActions: (
		set: (
			partial: Partial<
				TState & TActions & BaseModalState & BaseModalActions<TData>
			>,
		) => void,
		get: () => TState & TActions & BaseModalState & BaseModalActions<TData>,
	) => TActions,
) => {
	return create<TState & TActions & BaseModalState & BaseModalActions<TData>>()(
		(set, get) => {
			const baseActions: BaseModalActions<TData> = {
				openModal: (data?: TData) =>
					set({
						open: true,
						error: null,
						...(data ? { data } : {}), // Assuming 'data' might be part of TState if needed
						...initialState, // Reset other state to initial values
					} as Partial<
						TState & TActions & BaseModalState & BaseModalActions<TData>
					>),
				closeModal: () =>
					set({
						open: false,
						isLoading: false,
						isSaving: false,
						error: null,
						...initialState, // Reset other state to initial values
					} as Partial<
						TState & TActions & BaseModalState & BaseModalActions<TData>
					>),
				setLoading: (loading: boolean) =>
					set({ isLoading: loading } as Partial<
						TState & TActions & BaseModalState & BaseModalActions<TData>
					>),
				setSaving: (saving: boolean) =>
					set({ isSaving: saving } as Partial<
						TState & TActions & BaseModalState & BaseModalActions<TData>
					>),
				setError: (error: string | null) =>
					set({ error } as Partial<
						TState & TActions & BaseModalState & BaseModalActions<TData>
					>),
				reset: () =>
					set({
						...initialState,
						open: false,
						isLoading: false,
						isSaving: false,
						error: null,
					} as Partial<
						TState & TActions & BaseModalState & BaseModalActions<TData>
					>),
			};

			return {
				...initialState,
				open: false,
				isLoading: false,
				isSaving: false,
				error: null,
				...baseActions,
				...createActions(set, get),
			};
		},
	);
};
