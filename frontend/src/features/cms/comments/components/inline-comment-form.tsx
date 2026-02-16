import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { VoloCmsKitPublicCommentsCommentDto } from "@/infrastructure/api/types.gen";
import { Button } from "@/shared/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/shared/components/ui/form";
import { Textarea } from "@/shared/components/ui/textarea";
import {
	COMMENT_BUTTON_LABELS,
	COMMENT_FORM_LABELS,
	COMMENT_VALIDATION_MESSAGES,
} from "../constants";

const commentFormSchema = z.object({
	text: z
		.string()
		.min(1, COMMENT_VALIDATION_MESSAGES.TEXT_REQUIRED)
		.min(3, COMMENT_VALIDATION_MESSAGES.TEXT_MIN_LENGTH),
});

export type InlineCommentFormData = z.infer<typeof commentFormSchema>;

interface InlineCommentFormProps {
	comment?: VoloCmsKitPublicCommentsCommentDto | null;
	onSubmit: (data: InlineCommentFormData) => Promise<void>;
	onCancel?: () => void;
	isLoading?: boolean;
	mode: "create" | "edit" | "reply";
	autoFocus?: boolean;
}

export function InlineCommentForm({
	comment,
	onSubmit,
	onCancel,
	isLoading = false,
	mode,
	autoFocus = false,
}: InlineCommentFormProps) {
	const form = useForm<InlineCommentFormData>({
		resolver: zodResolver(commentFormSchema),
		defaultValues: {
			text: "",
		},
	});

	useEffect(() => {
		if (comment && mode === "edit") {
			form.reset({
				text: comment.text || "",
			});
		} else {
			form.reset({
				text: "",
			});
		}
	}, [comment, mode, form]);

	const handleSubmit = async (data: InlineCommentFormData) => {
		await onSubmit(data);
		form.reset();
	};

	const handleCancel = () => {
		form.reset();
		onCancel?.();
	};

	const getPlaceholder = () => {
		return mode === "reply"
			? COMMENT_FORM_LABELS.REPLY_PLACEHOLDER
			: COMMENT_FORM_LABELS.TEXT_PLACEHOLDER;
	};

	const getSubmitLabel = () => {
		if (isLoading) return "Posting...";
		switch (mode) {
			case "reply":
				return COMMENT_BUTTON_LABELS.REPLY;
			case "edit":
				return COMMENT_BUTTON_LABELS.SAVE;
			default:
				return COMMENT_BUTTON_LABELS.CREATE;
		}
	};

	return (
		<div className="rounded-lg border bg-card p-4">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="text"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea
										{...field}
										placeholder={getPlaceholder()}
										disabled={isLoading}
										rows={3}
										autoFocus={autoFocus}
										data-testid="field-comment-text"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex justify-end gap-2">
						{onCancel && (
							<Button
								type="button"
								variant="outline"
								onClick={handleCancel}
								disabled={isLoading}
							>
								{COMMENT_BUTTON_LABELS.CANCEL}
							</Button>
						)}
						<Button
							type="submit"
							disabled={isLoading}
							data-testid="btn-submit-comment"
						>
							{getSubmitLabel()}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
