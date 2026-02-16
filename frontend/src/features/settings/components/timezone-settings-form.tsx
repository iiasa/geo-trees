import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shared/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { SETTINGS_LABELS, SETTINGS_VALIDATION } from "../constants";
import {
	useTimezoneSettings,
	useTimezonesList,
	useUpdateTimezoneSettings,
} from "../hooks/use-timezone-settings";

const timezoneSettingsSchema = z.object({
	timezone: z.string().min(1, SETTINGS_VALIDATION.TIMEZONE.TIMEZONE_REQUIRED),
});

type TimezoneSettingsFormData = z.infer<typeof timezoneSettingsSchema>;

export function TimezoneSettingsForm() {
	const { data: currentTimezone, isLoading: settingsLoading } =
		useTimezoneSettings();
	const { data: timezonesList, isLoading: timezonesLoading } =
		useTimezonesList();
	const updateSettings = useUpdateTimezoneSettings();

	const form = useForm<TimezoneSettingsFormData>({
		resolver: zodResolver(timezoneSettingsSchema),
		defaultValues: {
			timezone: "",
		},
	});

	useEffect(() => {
		if (currentTimezone) {
			form.reset({
				timezone: currentTimezone,
			});
		}
	}, [currentTimezone, form]);

	const onSubmit = async (data: TimezoneSettingsFormData) => {
		await updateSettings.mutateAsync(data.timezone);
	};

	const isLoading = settingsLoading || timezonesLoading;

	if (isLoading) {
		return (
			<Card>
				<CardContent className="py-8">
					<div className="flex items-center justify-center">
						<div className="text-muted-foreground">Loading settings...</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardContent className="pt-6">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="timezone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{SETTINGS_LABELS.TIMEZONE.TIMEZONE}</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										value={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a timezone" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{timezonesList
												?.filter((tz) => tz.value && tz.value.trim() !== "")
												.map((tz) => (
													<SelectItem key={tz.value} value={tz.value || ""}>
														{tz.name || tz.value}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
									<FormMessage />
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
								: SETTINGS_LABELS.TIMEZONE.SAVE}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
