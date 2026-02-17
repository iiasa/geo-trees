import { create } from "zustand";
import type { ProfileDto } from "@/infrastructure/api/types.gen";

export interface ProfileFormState {
	userName: string;
	email: string;
	name: string;
	surname: string;
	phoneNumber: string;
	isDirty: boolean;
	isEditing: boolean;
}

interface ProfileFormStore extends ProfileFormState {
	setUserName: (userName: string) => void;
	setEmail: (email: string) => void;
	setName: (name: string) => void;
	setSurname: (surname: string) => void;
	setPhoneNumber: (phoneNumber: string) => void;
	setIsEditing: (isEditing: boolean) => void;
	initializeFromProfile: (profile: ProfileDto) => void;
	resetForm: (profile?: ProfileDto) => void;
	markClean: () => void;
}

export const useProfileFormStore = create<ProfileFormStore>((set) => ({
	userName: "",
	email: "",
	name: "",
	surname: "",
	phoneNumber: "",
	isDirty: false,
	isEditing: false,

	setUserName: (userName: string) => set({ userName, isDirty: true }),

	setEmail: (email: string) => set({ email, isDirty: true }),

	setName: (name: string) => set({ name, isDirty: true }),

	setSurname: (surname: string) => set({ surname, isDirty: true }),

	setPhoneNumber: (phoneNumber: string) => set({ phoneNumber, isDirty: true }),

	setIsEditing: (isEditing: boolean) => set({ isEditing }),

	initializeFromProfile: (profile: ProfileDto) =>
		set({
			userName: profile.userName || "",
			email: profile.email || "",
			name: profile.name || "",
			surname: profile.surname || "",
			phoneNumber: profile.phoneNumber || "",
			isDirty: false,
			isEditing: false,
		}),

	resetForm: (profile?: ProfileDto) =>
		set({
			userName: profile?.userName || "",
			email: profile?.email || "",
			name: profile?.name || "",
			surname: profile?.surname || "",
			phoneNumber: profile?.phoneNumber || "",
			isDirty: false,
			isEditing: false,
		}),

	markClean: () => set({ isDirty: false }),
}));
