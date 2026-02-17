import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getApiCmsKitPublicPagesExist } from "@/infrastructure/api/sdk.gen";
import type { VoloCmsKitAdminPagesPageDto } from "@/infrastructure/api/types.gen";
import { Button } from "@/shared/components/ui/button";
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
import { useNavigate } from "@tanstack/react-router";
import {
	PAGE_BUTTON_LABELS,
	PAGE_FORM_LABELS,
	PAGE_VALIDATION_MESSAGES,
} from "../constants";
import { PuckEditor } from "./puck-editor";
import { defaultPuckData } from "../config/puck-config";

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
	return title
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");
};

const pageFormSchema = z.object({
	title: z
		.string()
		.min(1, PAGE_VALIDATION_MESSAGES.TITLE_REQUIRED)
		.min(3, PAGE_VALIDATION_MESSAGES.TITLE_MIN_LENGTH),
	slug: z
		.string()
		.min(1, PAGE_VALIDATION_MESSAGES.SLUG_REQUIRED)
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, PAGE_VALIDATION_MESSAGES.SLUG_INVALID),
	content: z.string().optional(),
	layoutName: z.string().optional(),
	script: z.string().optional(),
	style: z.string().optional(),
});

export type PageFormData = z.infer<typeof pageFormSchema>;

interface PageFormProps {
	page?: VoloCmsKitAdminPagesPageDto | null;
	onSubmit: (data: PageFormData) => Promise<void>;
	isLoading?: boolean;
	mode: "create" | "edit";
}

export function PageForm({
	page,
	onSubmit,
	isLoading = false,
	mode,
}: PageFormProps) {
	const navigate = useNavigate();
	const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
	const [slugToCheck, setSlugToCheck] = useState<string | null>(null);

	const form = useForm<PageFormData>({
		resolver: zodResolver(pageFormSchema),
		defaultValues: {
			title: "",
			slug: "",
			content: "",
			layoutName: "",
			script: "",
			style: "",
		},
	});

	const watchTitle = form.watch("title");
	const watchSlug = form.watch("slug");

	// Check if slug exists (only for new slugs or when slug changes in edit mode)
	const { data: slugExistsData } = useQuery({
		queryKey: ["slug-exists", slugToCheck],
		queryFn: async () => {
			if (!slugToCheck) return null;
			const { data } = await getApiCmsKitPublicPagesExist({
				query: { slug: slugToCheck },
			});
			return data;
		},
		enabled:
			!!slugToCheck &&
			slugToCheck.length > 0 &&
			(mode === "create" || slugToCheck !== page?.slug),
	});

	// Update slug automatically when title changes (only if not manually edited)
	useEffect(() => {
		if (!isSlugManuallyEdited && watchTitle && mode === "create") {
			const newSlug = generateSlug(watchTitle);
			form.setValue("slug", newSlug);
		}
	}, [watchTitle, isSlugManuallyEdited, form, mode]);

	// Set slug to check when it changes
	useEffect(() => {
		if (watchSlug && watchSlug.length > 0) {
			const timer = setTimeout(() => {
				setSlugToCheck(watchSlug);
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [watchSlug]);

	// Update form when page changes
	useEffect(() => {
		if (page && mode === "edit") {
			// Parse and validate content structure
			let content = page.content || "";
			if (!content || content.trim() === "") {
				content = JSON.stringify(defaultPuckData);
			} else {
				// Parse and validate JSON structure
				try {
					const parsed = JSON.parse(content);
					// Validate it has the correct Puck data structure
					if (
						parsed &&
						typeof parsed === "object" &&
						"content" in parsed &&
						Array.isArray(parsed.content) &&
						"root" in parsed &&
						typeof parsed.root === "object"
					) {
						// Re-stringify to ensure proper formatting
						content = JSON.stringify(parsed);
					} else {
						// Invalid structure, use default
						content = JSON.stringify(defaultPuckData);
					}
				} catch {
					// Invalid JSON, use default
					content = JSON.stringify(defaultPuckData);
				}
			}
			form.reset({
				title: page.title || "",
				slug: page.slug || "",
				content,
				layoutName: page.layoutName || "",
				script: page.script || "",
				style: page.style || "",
			});
			setIsSlugManuallyEdited(true);
		} else if (mode === "create") {
			// Initialize with default serialized Puck data structure
			const defaultContent = JSON.stringify(defaultPuckData);
			form.reset({
				title: "",
				slug: "",
				content: defaultContent,
				layoutName: "",
				script: "",
				style: "",
			});
			setIsSlugManuallyEdited(false);
		}
	}, [page, mode, form]);

	const handleSubmit = async (data: PageFormData) => {
		// Check if slug exists before submitting
		if (slugExistsData === true) {
			form.setError("slug", {
				type: "manual",
				message: PAGE_VALIDATION_MESSAGES.SLUG_EXISTS,
			});
			return;
		}

		// Ensure content is properly serialized
		let serializedContent = data.content || "";
		if (!serializedContent || serializedContent === "") {
			// If content is empty, serialize default empty structure
			serializedContent = JSON.stringify(defaultPuckData);
		} else {
			// Validate that content is valid JSON
			try {
				const parsed = JSON.parse(serializedContent);
				if (!parsed || typeof parsed !== "object") {
					serializedContent = JSON.stringify(defaultPuckData);
				}
			} catch {
				// If invalid JSON, use default
				serializedContent = JSON.stringify(defaultPuckData);
			}
		}

		await onSubmit({
			...data,
			content: serializedContent,
		});
		if (mode === "create") {
			const defaultContent = JSON.stringify(defaultPuckData);
			form.reset({
				title: "",
				slug: "",
				content: defaultContent,
				layoutName: "",
				script: "",
				style: "",
			});
			setIsSlugManuallyEdited(false);
		}
	};

	return (
		<Form {...form}>
			<div className="space-y-4">
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{PAGE_FORM_LABELS.TITLE}</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder={PAGE_FORM_LABELS.TITLE_PLACEHOLDER}
										disabled={isLoading}
										data-testid="field-page-title"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="slug"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{PAGE_FORM_LABELS.SLUG}</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder={PAGE_FORM_LABELS.SLUG_PLACEHOLDER}
										disabled={isLoading}
										onChange={(e) => {
											setIsSlugManuallyEdited(true);
											field.onChange(e);
										}}
										data-testid="field-page-slug"
									/>
								</FormControl>
								<FormDescription>
									URL-friendly identifier for the page. Auto-generated from
									title.
								</FormDescription>
								{slugExistsData === true && (
									<p className="text-sm text-destructive">
										{PAGE_VALIDATION_MESSAGES.SLUG_EXISTS}
									</p>
								)}
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => navigate({ to: "/admin/cms/pages" })}
							disabled={isLoading}
							data-testid="btn-cancel-page"
							className="w-full sm:w-auto"
						>
							{PAGE_BUTTON_LABELS.CANCEL}
						</Button>
						<Button
							type="submit"
							disabled={isLoading || slugExistsData === true}
							data-testid="btn-submit-page"
							className="w-full sm:w-auto"
						>
							{isLoading ? "Saving..." : PAGE_BUTTON_LABELS.SAVE}
						</Button>
					</div>
				</form>

				{/* Puck editor outside form to avoid nested forms */}
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>{PAGE_FORM_LABELS.CONTENT}</FormLabel>
								<FormControl>
									<PuckEditor
										value={field.value || ""}
										onChange={field.onChange}
										disabled={isLoading}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
			</div>
		</Form>
	);
}
