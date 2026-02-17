import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import {
	deleteApiCmsKitAdminPagesByIdMutation,
	getApiCmsKitAdminPagesOptions,
	getApiCmsKitAdminPagesQueryKey,
	putApiCmsKitAdminPagesSetashomepageByIdMutation,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import type { VoloCmsKitAdminPagesPageDto } from "@/infrastructure/api/types.gen";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import {
	usePermissions,
	CMS_PERMISSIONS,
} from "@/shared/hooks/use-permissions";
import { PAGE_ACTION_MESSAGES, PAGE_DIALOG_TITLES } from "../constants";
import { PagesHeader } from "./pages-header";
import { PagesTable } from "./pages-table";

export function PagesList() {
	const { hasPermission } = usePermissions();
	const canDelete = hasPermission(CMS_PERMISSIONS.PAGES_DELETE);
	const [sorting, setSorting] = useState([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [deletePageId, setDeletePageId] = useState<string | null>(null);
	const [searchValue, setSearchValue] = useState("");
	const [selectedPages, setSelectedPages] = useState<string[]>([]);

	const queryOptions = {
		query: {
			MaxResultCount: pagination.pageSize,
			SkipCount: pagination.pageIndex * pagination.pageSize,
			...(searchValue && { Filter: searchValue }),
		},
	};
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const {
		data: pagesResponse,
		error,
		isError,
	} = useQuery(getApiCmsKitAdminPagesOptions(queryOptions));

	const deletePageMutation = useMutation({
		...deleteApiCmsKitAdminPagesByIdMutation(),
	});

	const setAsHomePageMutation = useMutation({
		...putApiCmsKitAdminPagesSetashomepageByIdMutation(),
	});

	const pages = pagesResponse?.items || [];
	const totalCount = pagesResponse?.totalCount || 0;

	const handleDeletePage = async (pageId: string) => {
		try {
			await deletePageMutation.mutateAsync({
				path: { id: pageId },
			});
			queryClient.invalidateQueries({
				queryKey: getApiCmsKitAdminPagesQueryKey(queryOptions),
			});
			toast.success(PAGE_ACTION_MESSAGES.DELETE_SUCCESS);
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: PAGE_ACTION_MESSAGES.DELETE_ERROR;
			toast.error(errorMessage);
			throw error;
		}
	};

	const handleSetAsHomepage = async (pageId: string) => {
		try {
			await setAsHomePageMutation.mutateAsync({
				path: { id: pageId },
			});
			queryClient.invalidateQueries({
				queryKey: getApiCmsKitAdminPagesQueryKey(queryOptions),
			});
			toast.success(PAGE_ACTION_MESSAGES.SET_HOMEPAGE_SUCCESS);
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: PAGE_ACTION_MESSAGES.SET_HOMEPAGE_ERROR;
			toast.error(errorMessage);
		}
	};

	const handleConfirmDelete = async () => {
		if (deletePageId === "bulk") {
			try {
				await Promise.all(
					selectedPages.map((pageId) =>
						deletePageMutation.mutateAsync({
							path: { id: pageId },
						}),
					),
				);
				queryClient.invalidateQueries({
					queryKey: getApiCmsKitAdminPagesQueryKey(queryOptions),
				});
				toast.success(PAGE_ACTION_MESSAGES.DELETE_SUCCESS);
				setSelectedPages([]);
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error
						? error.message
						: PAGE_ACTION_MESSAGES.DELETE_ERROR;
				toast.error(errorMessage);
			}
		} else if (deletePageId) {
			await handleDeletePage(deletePageId);
		}
		setDeletePageId(null);
	};

	const handleEditPage = (page: VoloCmsKitAdminPagesPageDto) => {
		if (!page.id) return;
		navigate({
			to: "/admin/cms/pages/$id/edit",
			params: { id: page.id },
		});
	};

	const handleCreateNewPage = () => {
		navigate({ to: "/admin/cms/pages/new" });
	};

	const handleOpenDeleteDialog = (pageId: string) => {
		setDeletePageId(pageId);
	};

	if (isError) {
		return (
			<Alert variant="destructive">
				<AlertDescription>
					Failed to load pages: {error?.error?.message || "Unknown error"}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-4">
			<PagesHeader
				totalCount={totalCount}
				onCreatePage={handleCreateNewPage}
				isCreating={false}
				onSearchChange={(value: string) => setSearchValue(value)}
				searchValue={searchValue}
			/>

			{selectedPages.length > 0 && canDelete && (
				<div
					className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 bg-muted rounded-lg"
					data-testid="bulk-actions"
				>
					<span className="text-sm text-muted-foreground">
						{selectedPages.length} page(s) selected
					</span>
					<Button
						variant="destructive"
						size="sm"
						data-testid="bulk-delete-btn"
						onClick={() => setDeletePageId("bulk")}
						disabled={deletePageMutation.isPending}
						className="w-full sm:w-auto"
					>
						{deletePageMutation.isPending ? "Deleting..." : "Delete Selected"}
					</Button>
				</div>
			)}

			<PagesTable
				pages={pages}
				sorting={sorting}
				pagination={pagination}
				totalCount={totalCount}
				onSortingChange={(sorting) => setSorting(sorting)}
				onPaginationChange={(pagination) => setPagination(pagination)}
				onEditPage={handleEditPage}
				onDeletePage={handleOpenDeleteDialog}
				onSetAsHomepage={handleSetAsHomepage}
				isDeleting={deletePageMutation.isPending}
				selectedPages={selectedPages}
				onSelectedPagesChange={(pageIds: string[]) => setSelectedPages(pageIds)}
			/>

			<AlertDialog
				open={!!deletePageId}
				onOpenChange={() => setDeletePageId(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{PAGE_DIALOG_TITLES.DELETE}</AlertDialogTitle>
						<AlertDialogDescription>
							{deletePageId === "bulk"
								? `Are you sure you want to delete ${selectedPages.length} selected page(s)? This action cannot be undone.`
								: PAGE_DIALOG_TITLES.DELETE_CONFIRMATION}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							data-testid={
								deletePageId === "bulk"
									? "confirm-bulk-delete-btn"
									: "confirm-delete-btn"
							}
							onClick={handleConfirmDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
