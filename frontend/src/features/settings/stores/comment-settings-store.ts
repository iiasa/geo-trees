import { create } from "zustand";

interface CommentSettingsState {
	commentRequireApprovement: boolean;
	isLoading: boolean;
	isSaving: boolean;
	error: string | null;
}

interface CommentSettingsActions {
	setCommentRequireApprovement: (requireApprovement: boolean) => void;
	setLoading: (loading: boolean) => void;
	setSaving: (saving: boolean) => void;
	setError: (error: string | null) => void;
	reset: () => void;
}

type CommentSettingsStore = CommentSettingsState & CommentSettingsActions;

const initialState: CommentSettingsState = {
	commentRequireApprovement: false,
	isLoading: false,
	isSaving: false,
	error: null,
};

export const useCommentSettingsStore = create<CommentSettingsStore>((set) => ({
	...initialState,

	setCommentRequireApprovement: (commentRequireApprovement) =>
		set({ commentRequireApprovement }),
	setLoading: (isLoading) => set({ isLoading }),
	setSaving: (isSaving) => set({ isSaving }),
	setError: (error) => set({ error }),
	reset: () => set(initialState),
}));
