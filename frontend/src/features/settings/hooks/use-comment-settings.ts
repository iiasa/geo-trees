import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { commentAdminUpdateSettings } from "@/infrastructure/api/sdk.gen";
import type { CommentSettingsDto } from "@/infrastructure/api/types.gen";
import { SETTINGS_MESSAGES } from "../constants";

export function useUpdateCommentSettings() {
	return useMutation({
		mutationFn: async (data: CommentSettingsDto) => {
			const { data: result } = await commentAdminUpdateSettings({
				body: data,
				throwOnError: true,
			});
			return result;
		},
		onSuccess: () => {
			toast.success(SETTINGS_MESSAGES.COMMENTS.SAVE_SUCCESS);
		},
		onError: () => {
			toast.error(SETTINGS_MESSAGES.COMMENTS.SAVE_ERROR);
		},
	});
}
