import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	timeZoneSettingsGetOptions,
	timeZoneSettingsGetTimezonesOptions,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import { timeZoneSettingsUpdate } from "@/infrastructure/api/sdk.gen";
import { SETTINGS_MESSAGES } from "../constants";

export function useTimezoneSettings() {
	return useQuery(timeZoneSettingsGetOptions({}));
}

export function useTimezonesList() {
	return useQuery(timeZoneSettingsGetTimezonesOptions({}));
}

export function useUpdateTimezoneSettings() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (timezone: string) => {
			const { data: result } = await timeZoneSettingsUpdate({
				query: { timezone },
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
						query.queryKey[0].url === "/api/setting-management/timezone"
					);
				},
			});
			toast.success(SETTINGS_MESSAGES.TIMEZONE.SAVE_SUCCESS);
		},
		onError: () => {
			toast.error(SETTINGS_MESSAGES.TIMEZONE.SAVE_ERROR);
		},
	});
}
