import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { SETTINGS_LABELS, SETTINGS_VALIDATION } from "../constants";
import { useSendTestEmail } from "../hooks/use-email-settings";

const testEmailSchema = z.object({
	senderEmailAddress: z
		.string()
		.min(1, SETTINGS_VALIDATION.TEST_EMAIL.SENDER_EMAIL_REQUIRED)
		.email(SETTINGS_VALIDATION.TEST_EMAIL.EMAIL_INVALID),
	targetEmailAddress: z
		.string()
		.min(1, SETTINGS_VALIDATION.TEST_EMAIL.TARGET_EMAIL_REQUIRED)
		.email(SETTINGS_VALIDATION.TEST_EMAIL.EMAIL_INVALID),
	subject: z.string().min(1, SETTINGS_VALIDATION.TEST_EMAIL.SUBJECT_REQUIRED),
	body: z.string().optional(),
});

type TestEmailFormData = z.infer<typeof testEmailSchema>;

interface TestEmailDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	defaultFromAddress?: string;
}

export function TestEmailDialog({
	open,
	onOpenChange,
	defaultFromAddress,
}: TestEmailDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const sendTestEmail = useSendTestEmail();

	const form = useForm<TestEmailFormData>({
		resolver: zodResolver(testEmailSchema),
		defaultValues: {
			senderEmailAddress: defaultFromAddress || "",
			targetEmailAddress: "",
			subject: "Test Email",
			body: "This is a test email from Geo Trees.",
		},
	});

	const onSubmit = async (data: TestEmailFormData) => {
		setIsSubmitting(true);
		try {
			await sendTestEmail.mutateAsync(data);
			form.reset();
			onOpenChange(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>{SETTINGS_LABELS.TEST_EMAIL_DIALOG.TITLE}</DialogTitle>
					<DialogDescription>
						{SETTINGS_LABELS.TEST_EMAIL_DIALOG.DESCRIPTION}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="senderEmailAddress"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{SETTINGS_LABELS.TEST_EMAIL_DIALOG.SENDER_EMAIL}
									</FormLabel>
									<FormControl>
										<Input type="email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="targetEmailAddress"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{SETTINGS_LABELS.TEST_EMAIL_DIALOG.TARGET_EMAIL}
									</FormLabel>
									<FormControl>
										<Input type="email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="subject"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{SETTINGS_LABELS.TEST_EMAIL_DIALOG.SUBJECT}
									</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="body"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{SETTINGS_LABELS.TEST_EMAIL_DIALOG.BODY}
									</FormLabel>
									<FormControl>
										<Textarea rows={4} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={isSubmitting}
							>
								{SETTINGS_LABELS.TEST_EMAIL_DIALOG.CANCEL}
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting
									? "Sending..."
									: SETTINGS_LABELS.TEST_EMAIL_DIALOG.SEND}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
