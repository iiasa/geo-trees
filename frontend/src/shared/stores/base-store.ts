import { create } from "zustand";

interface BaseState {
	isLoading: boolean;
	error: string | null;
}

interface BaseActions {
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	reset: () => void;
}

// Export types for form stores
export type BaseFormStore<T> = BaseState & {
	data: T | null;
	isSaving: boolean;
};

export const createFormStoreActions = <T>() => ({
	setData: (data: T | null) => ({ data }) as Partial<BaseFormStore<T>>,
	setSaving: (isSaving: boolean) => ({ isSaving }) as Partial<BaseFormStore<T>>,
});

export const createInitialFormState = <T>(
	initialData?: T,
): BaseFormStore<T> => ({
	data: initialData || null,
	isLoading: false,
	error: null,
	isSaving: false,
});

export const createBaseStore = <TState extends object, TActions extends object>(
	initialState: TState,
	createActions: (
		set: (
			partial: Partial<TState & TActions & BaseState & BaseActions>,
		) => void,
		get: () => TState & TActions & BaseState & BaseActions,
	) => TActions,
) => {
	return create<TState & TActions & BaseState & BaseActions>()((set, get) => {
		const baseActions: BaseActions = {
			setLoading: (loading: boolean) =>
				set({ isLoading: loading } as Partial<
					TState & TActions & BaseState & BaseActions
				>),
			setError: (error: string | null) =>
				set({ error } as Partial<TState & TActions & BaseState & BaseActions>),
			reset: () =>
				set({
					...initialState,
					isLoading: false,
					error: null,
				} as Partial<TState & TActions & BaseState & BaseActions>),
		};

		return {
			...initialState,
			isLoading: false,
			error: null,
			...baseActions,
			...createActions(set, get),
		};
	});
};
