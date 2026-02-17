import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import {
	getApiCmsKitAdminPagesByIdOptions,
	getApiCmsKitAdminPagesQueryKey,
	putApiCmsKitAdminPagesByIdMutation,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import { PageHeader } from "@/shared/components/page-header";
import { PageLayout } from "@/shared/components/page-layout";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { PAGE_ACTION_MESSAGES, PAGE_EDIT_CONSTANTS } from "../constants";
import { PageForm, type PageFormData } from "./page-form";

export function EditPage() {
	const { id } = useParams({ from: "/admin/cms/pages/$id/edit" });
	const queryClient = useQueryClient();

	const {
		data: page,
		isLoading: isLoadingPage,
		error,
		isError,
	} = useQuery(getApiCmsKitAdminPagesByIdOptions({ path: { id } }));

	const updatePageMutation = useMutation({
		...putApiCmsKitAdminPagesByIdMutation(),
	});

	const handleSubmit = async (data: PageFormData) => {
		if (!page?.id) return;
		try {
			await updatePageMutation.mutateAsync({
				path: { id: page.id },
				body: {
					title: data.title,
					slug: data.slug,
					content: data.content || null,
					layoutName: data.layoutName || null,
					script: data.script || null,
					style: data.style || null,
					concurrencyStamp: page.concurrencyStamp || null,
				},
			});

			await queryClient.invalidateQueries({
				queryKey: getApiCmsKitAdminPagesQueryKey(),
			});
			await queryClient.refetchQueries({
				queryKey: getApiCmsKitAdminPagesQueryKey(),
			});
			// Refetch the current page to show updated data
			await queryClient.refetchQueries({
				queryKey: getApiCmsKitAdminPagesByIdOptions({ path: { id: page.id } })
					.queryKey,
			});
			toast.success(PAGE_ACTION_MESSAGES.UPDATE_SUCCESS);
			// Stay on the page after save - form will be updated with refetched data
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: PAGE_ACTION_MESSAGES.UPDATE_ERROR;
			toast.error(errorMessage);
			throw error;
		}
	};

	if (isError) {
		return (
			<PageLayout>
				<Alert variant="destructive">
					<AlertDescription>
						Failed to load page: {error?.error?.message || "Unknown error"}
					</AlertDescription>
				</Alert>
			</PageLayout>
		);
	}

	if (isLoadingPage || !page) {
		return (
			<PageLayout>
				<div className="text-center py-8">
					<p className="text-muted-foreground">Loading page...</p>
				</div>
			</PageLayout>
		);
	}

	return (
		<PageLayout>
			<div className="space-y-6">
				<PageHeader
					title={PAGE_EDIT_CONSTANTS.TITLE}
					description={PAGE_EDIT_CONSTANTS.DESCRIPTION}
				/>
				<PageForm
					page={page}
					onSubmit={handleSubmit}
					isLoading={updatePageMutation.isPending}
					mode="edit"
				/>
			</div>
		</PageLayout>
	);
}
