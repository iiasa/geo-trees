import { create } from "zustand";
import type { EmailSettingsDto } from "@/infrastructure/api/types.gen";

interface EmailSettingsState {
	settings: EmailSettingsDto | null;
	isLoading: boolean;
	isSaving: boolean;
	error: string | null;
}

interface EmailSettingsActions {
	setSettings: (settings: EmailSettingsDto | null) => void;
	setLoading: (loading: boolean) => void;
	setSaving: (saving: boolean) => void;
	setError: (error: string | null) => void;
	reset: () => void;
}

type EmailSettingsStore = EmailSettingsState & EmailSettingsActions;

const initialState: EmailSettingsState = {
	settings: null,
	isLoading: false,
	isSaving: false,
	error: null,
};

export const useEmailSettingsStore = create<EmailSettingsStore>((set) => ({
	...initialState,

	setSettings: (settings) => set({ settings }),
	setLoading: (isLoading) => set({ isLoading }),
	setSaving: (isSaving) => set({ isSaving }),
	setError: (error) => set({ error }),
	reset: () => set(initialState),
}));
