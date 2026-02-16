import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	profileChangePasswordMutation,
	profileGetOptions,
	profileUpdateMutation,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import type { ProfileDto } from "@/infrastructure/api/types.gen";
import { PROFILE_MESSAGES } from "../constants";

const PROFILE_QUERY_KEY = ["profile", "my-profile"];

export function useProfileData() {
	const {
		data: profile,
		isLoading,
		error,
		refetch,
	} = useQuery(profileGetOptions());

	return {
		profile: profile as ProfileDto | undefined,
		isLoading,
		error,
		refetch,
	};
}

export function useUpdateProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		...profileUpdateMutation(),
		onSuccess: (data) => {
			queryClient.setQueryData(PROFILE_QUERY_KEY, data);
			toast.success(PROFILE_MESSAGES.GENERAL.SAVE_SUCCESS);
		},
		onError: (error) => {
			console.error("Failed to update profile:", error);
			toast.error(PROFILE_MESSAGES.GENERAL.SAVE_ERROR);
		},
	});
}

export function useChangePassword() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: profileChangePasswordMutation().mutationFn,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
			toast.success(PROFILE_MESSAGES.SECURITY.SAVE_SUCCESS);
		},
		onError: (error: unknown) => {
			console.error("Failed to change password:", error);

			// Check if it's an incorrect current password error
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			if (
				errorMessage.includes("current") ||
				errorMessage.includes("incorrect")
			) {
				toast.error(PROFILE_MESSAGES.SECURITY.INCORRECT_CURRENT);
			} else {
				toast.error(PROFILE_MESSAGES.SECURITY.SAVE_ERROR);
			}
		},
	});
}

export function useProfileMutations() {
	const updateProfile = useUpdateProfile();
	const changePassword = useChangePassword();

	return {
		updateProfile,
		changePassword,
	};
}
