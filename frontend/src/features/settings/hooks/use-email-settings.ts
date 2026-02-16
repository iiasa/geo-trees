import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { emailSettingsGetOptions } from "@/infrastructure/api/@tanstack/react-query.gen";
import {
	emailSettingsSendTestEmail,
	emailSettingsUpdate,
} from "@/infrastructure/api/sdk.gen";
import type {
	SendTestEmailInput,
	UpdateEmailSettingsDto,
} from "@/infrastructure/api/types.gen";
import { SETTINGS_MESSAGES } from "../constants";

export function useEmailSettings() {
	return useQuery(emailSettingsGetOptions({}));
}

export function useUpdateEmailSettings() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: UpdateEmailSettingsDto) => {
			const { data: result } = await emailSettingsUpdate({
				body: data,
				throwOnError: true,
			});
			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) => {
					return (
						query.queryKey[0] !== undefined &&
						typeof query.queryKey[0] === "object" &&
						query.queryKey[0] !== null &&
						"url" in query.queryKey[0] &&
						query.queryKey[0].url === "/api/setting-management/emailing"
					);
				},
			});
			toast.success(SETTINGS_MESSAGES.EMAIL.SAVE_SUCCESS);
		},
		onError: () => {
			toast.error(SETTINGS_MESSAGES.EMAIL.SAVE_ERROR);
		},
	});
}

export function useSendTestEmail() {
	return useMutation({
		mutationFn: async (data: SendTestEmailInput) => {
			const { data: result } = await emailSettingsSendTestEmail({
				body: data,
				throwOnError: true,
			});
			return result;
		},
		onSuccess: () => {
			toast.success(SETTINGS_MESSAGES.EMAIL.TEST_EMAIL_SUCCESS);
		},
		onError: () => {
			toast.error(SETTINGS_MESSAGES.EMAIL.TEST_EMAIL_ERROR);
		},
	});
}
