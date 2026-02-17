import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "@/shared/components/ui/form";
import { Switch } from "@/shared/components/ui/switch";
import { SETTINGS_LABELS } from "../constants";
import { useUpdateCommentSettings } from "../hooks/use-comment-settings";

const commentSettingsSchema = z.object({
	commentRequireApprovement: z.boolean(),
});

type CommentSettingsFormData = z.infer<typeof commentSettingsSchema>;

export function CommentSettingsForm() {
	const updateSettings = useUpdateCommentSettings();

	const form = useForm<CommentSettingsFormData>({
		resolver: zodResolver(commentSettingsSchema),
		defaultValues: {
			commentRequireApprovement: false,
		},
	});

	const onSubmit = async (data: CommentSettingsFormData) => {
		await updateSettings.mutateAsync(data);
	};

	return (
		<Card>
			<CardContent className="pt-6">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="commentRequireApprovement"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											{SETTINGS_LABELS.COMMENTS.REQUIRE_APPROVAL}
										</FormLabel>
										<FormDescription>
											When enabled, all comments will require admin approval
											before being published
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							disabled={updateSettings.isPending}
							className="w-full sm:w-auto"
						>
							{updateSettings.isPending
								? "Saving..."
								: SETTINGS_LABELS.COMMENTS.SAVE}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
