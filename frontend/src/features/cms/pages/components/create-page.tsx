import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	postApiCmsKitAdminPagesMutation,
	getApiCmsKitAdminPagesQueryKey,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import { PageHeader } from "@/shared/components/page-header";
import { PageLayout } from "@/shared/components/page-layout";
import { PAGE_ACTION_MESSAGES, PAGE_CREATE_CONSTANTS } from "../constants";
import { PageForm, type PageFormData } from "./page-form";

export function CreatePage() {
	const queryClient = useQueryClient();

	const createPageMutation = useMutation({
		...postApiCmsKitAdminPagesMutation(),
	});

	const handleSubmit = async (data: PageFormData) => {
		try {
			await createPageMutation.mutateAsync({
				body: {
					title: data.title,
					slug: data.slug,
					content: data.content || null,
					layoutName: data.layoutName || null,
					script: data.script || null,
					style: data.style || null,
				},
			});
			queryClient.invalidateQueries({
				queryKey: getApiCmsKitAdminPagesQueryKey(),
			});
			toast.success(PAGE_ACTION_MESSAGES.CREATE_SUCCESS);
			// Stay on the page after save
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: PAGE_ACTION_MESSAGES.CREATE_ERROR;
			toast.error(errorMessage);
			throw error;
		}
	};

	return (
		<PageLayout>
			<div className="space-y-6">
				<PageHeader
					title={PAGE_CREATE_CONSTANTS.TITLE}
					description={PAGE_CREATE_CONSTANTS.DESCRIPTION}
				/>
				<PageForm
					onSubmit={handleSubmit}
					isLoading={createPageMutation.isPending}
					mode="create"
				/>
			</div>
		</PageLayout>
	);
}
