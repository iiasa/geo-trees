import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { VoloCmsKitPublicCommentsCommentDto } from "@/infrastructure/api/types.gen";
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
import { Textarea } from "@/shared/components/ui/textarea";
import {
	COMMENT_BUTTON_LABELS,
	COMMENT_DIALOG_TITLES,
	COMMENT_FORM_LABELS,
	COMMENT_VALIDATION_MESSAGES,
} from "../constants";
import { useCommentFormStore } from "../stores/comment-form-store";

const commentFormSchema = z.object({
	text: z
		.string()
		.min(1, COMMENT_VALIDATION_MESSAGES.TEXT_REQUIRED)
		.min(3, COMMENT_VALIDATION_MESSAGES.TEXT_MIN_LENGTH),
});

export type CommentFormData = z.infer<typeof commentFormSchema>;

interface CommentFormProps {
	comment?: VoloCmsKitPublicCommentsCommentDto | null;
	onSubmit: (data: CommentFormData) => Promise<void>;
	isLoading?: boolean;
	mode: "create" | "edit" | "reply";
}

export function CommentForm({
	comment,
	onSubmit,
	isLoading = false,
	mode,
}: CommentFormProps) {
	const { open, closeForm } = useCommentFormStore();

	const form = useForm<CommentFormData>({
		resolver: zodResolver(commentFormSchema),
		defaultValues: {
			text: "",
		},
	});

	// Update form when comment changes
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

	const handleSubmit = async (data: CommentFormData) => {
		await onSubmit(data);
		form.reset();
	};

	const handleClose = () => {
		form.reset();
		closeForm();
	};

	const getTitle = () => {
		switch (mode) {
			case "edit":
				return COMMENT_DIALOG_TITLES.EDIT;
			case "reply":
				return COMMENT_DIALOG_TITLES.REPLY;
			default:
				return COMMENT_DIALOG_TITLES.CREATE;
		}
	};

	const getPlaceholder = () => {
		return mode === "reply"
			? COMMENT_FORM_LABELS.REPLY_PLACEHOLDER
			: COMMENT_FORM_LABELS.TEXT_PLACEHOLDER;
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>{getTitle()}</DialogTitle>
					<DialogDescription>
						{mode === "reply"
							? "Reply to this comment"
							: mode === "edit"
								? "Edit your comment"
								: "Add a new comment"}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="text"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{COMMENT_FORM_LABELS.TEXT}</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											placeholder={getPlaceholder()}
											disabled={isLoading}
											rows={5}
											data-testid="field-comment-text"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={handleClose}
								disabled={isLoading}
							>
								{COMMENT_BUTTON_LABELS.CANCEL}
							</Button>
							<Button
								type="submit"
								disabled={isLoading}
								data-testid="btn-submit-comment"
							>
								{isLoading
									? "Posting..."
									: mode === "reply"
										? COMMENT_BUTTON_LABELS.REPLY
										: COMMENT_BUTTON_LABELS.SAVE}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
