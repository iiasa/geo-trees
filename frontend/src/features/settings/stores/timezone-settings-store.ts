import { create } from "zustand";

interface TimezoneSettingsState {
	timezone: string | null;
	isLoading: boolean;
	isSaving: boolean;
	error: string | null;
}

interface TimezoneSettingsActions {
	setTimezone: (timezone: string | null) => void;
	setLoading: (loading: boolean) => void;
	setSaving: (saving: boolean) => void;
	setError: (error: string | null) => void;
	reset: () => void;
}

type TimezoneSettingsStore = TimezoneSettingsState & TimezoneSettingsActions;

const initialState: TimezoneSettingsState = {
	timezone: null,
	isLoading: false,
	isSaving: false,
	error: null,
};

export const useTimezoneSettingsStore = create<TimezoneSettingsStore>(
	(set) => ({
		...initialState,

		setTimezone: (timezone) => set({ timezone }),
		setLoading: (isLoading) => set({ isLoading }),
		setSaving: (isSaving) => set({ isSaving }),
		setError: (error) => set({ error }),
		reset: () => set(initialState),
	}),
);
