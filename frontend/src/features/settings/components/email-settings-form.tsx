import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useEffect, useState } from "react";
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
	FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Switch } from "@/shared/components/ui/switch";
import { SETTINGS_LABELS, SETTINGS_VALIDATION } from "../constants";
import {
	useEmailSettings,
	useUpdateEmailSettings,
} from "../hooks/use-email-settings";
import { TestEmailDialog } from "./test-email-dialog";

const emailSettingsSchema = z.object({
	smtpHost: z.string().optional().nullable(),
	smtpPort: z
		.number()
		.min(1, SETTINGS_VALIDATION.EMAIL.SMTP_PORT_MIN)
		.max(65535, SETTINGS_VALIDATION.EMAIL.SMTP_PORT_MAX)
		.optional(),
	smtpUserName: z.string().optional().nullable(),
	smtpPassword: z.string().optional().nullable(),
	smtpDomain: z.string().optional().nullable(),
	smtpEnableSsl: z.boolean().optional(),
	smtpUseDefaultCredentials: z.boolean().optional(),
	defaultFromAddress: z.string(),
	defaultFromDisplayName: z.string(),
});

type EmailSettingsFormData = z.infer<typeof emailSettingsSchema>;

export function EmailSettingsForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [testEmailDialogOpen, setTestEmailDialogOpen] = useState(false);
	const { data: emailSettings, isLoading } = useEmailSettings();
	const updateSettings = useUpdateEmailSettings();

	const form = useForm<EmailSettingsFormData>({
		resolver: zodResolver(emailSettingsSchema),
		defaultValues: {
			smtpHost: null,
			smtpPort: 587,
			smtpUserName: null,
			smtpPassword: null,
			smtpDomain: null,
			smtpEnableSsl: true,
			smtpUseDefaultCredentials: false,
			defaultFromAddress: "",
			defaultFromDisplayName: "",
		},
	});

	useEffect(() => {
		if (emailSettings) {
			form.reset({
				smtpHost: emailSettings.smtpHost ?? null,
				smtpPort: emailSettings.smtpPort ?? 587,
				smtpUserName: emailSettings.smtpUserName ?? null,
				smtpPassword: emailSettings.smtpPassword ?? null,
				smtpDomain: emailSettings.smtpDomain ?? null,
				smtpEnableSsl: emailSettings.smtpEnableSsl ?? true,
				smtpUseDefaultCredentials:
					emailSettings.smtpUseDefaultCredentials ?? false,
				defaultFromAddress: emailSettings.defaultFromAddress ?? "",
				defaultFromDisplayName: emailSettings.defaultFromDisplayName ?? "",
			});
		}
	}, [emailSettings, form]);

	const onSubmit = async (data: EmailSettingsFormData) => {
		await updateSettings.mutateAsync(data);
	};

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
		<>
			<Card>
				<CardContent className="pt-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2">
								<FormField
									control={form.control}
									name="smtpHost"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{SETTINGS_LABELS.EMAIL.SMTP_HOST}</FormLabel>
											<FormControl>
												<Input
													placeholder="smtp.gmail.com"
													{...field}
													value={field.value || ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="smtpPort"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{SETTINGS_LABELS.EMAIL.SMTP_PORT}</FormLabel>
											<FormControl>
												<Input type="number" placeholder="587" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<FormField
									control={form.control}
									name="smtpUserName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{SETTINGS_LABELS.EMAIL.SMTP_USERNAME}
											</FormLabel>
											<FormControl>
												<Input
													placeholder="username@example.com"
													{...field}
													value={field.value || ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="smtpPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{SETTINGS_LABELS.EMAIL.SMTP_PASSWORD}
											</FormLabel>
											<FormControl>
												<div className="relative">
													<Input
														type={showPassword ? "text" : "password"}
														placeholder="••••••••"
														{...field}
														value={field.value || ""}
													/>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
														onClick={() => setShowPassword(!showPassword)}
													>
														{showPassword ? (
															<EyeOff className="h-4 w-4" />
														) : (
															<Eye className="h-4 w-4" />
														)}
													</Button>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="smtpDomain"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{SETTINGS_LABELS.EMAIL.SMTP_DOMAIN}</FormLabel>
										<FormControl>
											<Input
												placeholder="example.com"
												{...field}
												value={field.value || ""}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid gap-4 md:grid-cols-2">
								<FormField
									control={form.control}
									name="defaultFromAddress"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{SETTINGS_LABELS.EMAIL.DEFAULT_FROM_ADDRESS}
											</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="noreply@example.com"
													{...field}
													value={field.value || ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="defaultFromDisplayName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{SETTINGS_LABELS.EMAIL.DEFAULT_FROM_DISPLAY_NAME}
											</FormLabel>
											<FormControl>
												<Input
													placeholder="My Application"
													{...field}
													value={field.value || ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="space-y-4">
								<FormField
									control={form.control}
									name="smtpEnableSsl"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
											<div className="space-y-0.5">
												<FormLabel className="text-base">
													{SETTINGS_LABELS.EMAIL.ENABLE_SSL}
												</FormLabel>
												<FormDescription>
													Enable SSL/TLS for secure email transmission
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

								<FormField
									control={form.control}
									name="smtpUseDefaultCredentials"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
											<div className="space-y-0.5">
												<FormLabel className="text-base">
													{SETTINGS_LABELS.EMAIL.USE_DEFAULT_CREDENTIALS}
												</FormLabel>
												<FormDescription>
													Use default system credentials for authentication
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
							</div>

							<div className="flex flex-col sm:flex-row gap-3">
								<Button
									type="submit"
									disabled={updateSettings.isPending}
									className="w-full sm:w-auto"
								>
									{updateSettings.isPending
										? "Saving..."
										: SETTINGS_LABELS.EMAIL.SAVE}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => setTestEmailDialogOpen(true)}
									className="w-full sm:w-auto"
								>
									<Mail className="mr-2 h-4 w-4" />
									{SETTINGS_LABELS.EMAIL.TEST_EMAIL}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>

			<TestEmailDialog
				open={testEmailDialogOpen}
				onOpenChange={setTestEmailDialogOpen}
				defaultFromAddress={form.getValues("defaultFromAddress") || ""}
			/>
		</>
	);
}
