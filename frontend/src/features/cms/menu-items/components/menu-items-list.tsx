import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
	postApiCmsKitAdminMenuItemsMutation,
	deleteApiCmsKitAdminMenuItemsByIdMutation,
	getApiCmsKitAdminMenuItemsOptions,
	getApiCmsKitAdminMenuItemsQueryKey,
	getApiCmsKitAdminMenuItemsLookupPagesOptions,
	getApiCmsKitAdminMenuItemsLookupPermissionsOptions,
	putApiCmsKitAdminMenuItemsByIdMoveMutation,
	putApiCmsKitAdminMenuItemsByIdMutation,
	getApiCmsKitPublicMenuItemsOptions,
	getApiCmsKitPublicMenuItemsQueryKey,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import type { MenuItemDto } from "@/infrastructure/api/types.gen";
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
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
	MENU_ITEM_BUTTONS,
	MENU_ITEM_EMPTY_STATES,
	MENU_ITEM_MESSAGES,
	MENU_ITEM_SEARCH,
	MENU_ITEMS_PAGE_COPY,
} from "../constants";
import {
	useMenuItemFormStore,
	useMenuItemMoveStore,
} from "../stores/menu-item-store";
import {
	buildMenuTree,
	buildParentOptions,
	flattenMenuTree,
	getSiblingCount,
} from "../utils";
import { MenuItemForm } from "./menu-item-form";
import type { MenuItemFormValues } from "./menu-item-form-schema";
import { MenuItemMoveDialog } from "./menu-item-move-dialog";
import { MenuItemsTable } from "./menu-items-table";
import { MenuItemsTree } from "./menu-items-tree";

export function MenuItemsList() {
	const queryClient = useQueryClient();
	const [searchTerm, setSearchTerm] = useState("");
	const [deleteId, setDeleteId] = useState<string | null>(null);

	const {
		open,
		mode,
		menuItemId,
		parentId,
		defaultOrder,
		startCreate,
		startEdit,
		closeForm,
	} = useMenuItemFormStore();

	const {
		open: moveOpen,
		menuItemId: moveItemId,
		openMove,
		closeMove,
	} = useMenuItemMoveStore();

	const adminQuery = useQuery(getApiCmsKitAdminMenuItemsOptions());
	const publicQuery = useQuery(getApiCmsKitPublicMenuItemsOptions());
	const pageLookupQuery = useQuery(
		getApiCmsKitAdminMenuItemsLookupPagesOptions({
			query: { MaxResultCount: 200 },
		}),
	);
	const permissionLookupQuery = useQuery(
		getApiCmsKitAdminMenuItemsLookupPermissionsOptions(),
	);

	const createMutation = useMutation(postApiCmsKitAdminMenuItemsMutation());
	const updateMutation = useMutation(putApiCmsKitAdminMenuItemsByIdMutation());
	const deleteMutation = useMutation(
		deleteApiCmsKitAdminMenuItemsByIdMutation(),
	);
	const moveMutation = useMutation(
		putApiCmsKitAdminMenuItemsByIdMoveMutation(),
	);

	const adminItems = adminQuery.data?.items ?? [];
	const adminTree = useMemo(() => buildMenuTree(adminItems), [adminItems]);
	const flattenedItems = useMemo(() => flattenMenuTree(adminTree), [adminTree]);

	const filteredItems = useMemo(() => {
		if (!searchTerm) return flattenedItems;
		const term = searchTerm.toLowerCase();
		return flattenedItems.filter((item) => {
			const name = item.displayName?.toLowerCase() ?? "";
			const url = item.url?.toLowerCase() ?? "";
			const permission = item.requiredPermissionName?.toLowerCase() ?? "";
			return (
				name.includes(term) || url.includes(term) || permission.includes(term)
			);
		});
	}, [flattenedItems, searchTerm]);

	const parentOptions = useMemo(
		() => buildParentOptions(adminTree),
		[adminTree],
	);

	const editingItem = adminItems.find((item) => item.id === menuItemId) ?? null;
	const movingItem = adminItems.find((item) => item.id === moveItemId) ?? null;

	const pageTitles = useMemo(() => {
		const map: Record<string, string> = {};
		pageLookupQuery.data?.items?.forEach((page) => {
			if (page?.id) {
				map[page.id] = page.title ?? page.slug ?? page.id;
			}
		});
		return map;
	}, [pageLookupQuery.data]);

	const permissionLabels = useMemo(() => {
		const map: Record<string, string> = {};
		permissionLookupQuery.data?.items?.forEach((permission) => {
			if (permission?.name) {
				map[permission.name] = permission.displayName ?? permission.name;
			}
		});
		return map;
	}, [permissionLookupQuery.data]);

	const publicItems = publicQuery.data ?? [];
	const publicTree = useMemo(() => buildMenuTree(publicItems), [publicItems]);

	const invalidateMenuQueries = () => {
		queryClient.invalidateQueries({
			queryKey: getApiCmsKitAdminMenuItemsQueryKey(),
		});
		queryClient.invalidateQueries({
			queryKey: getApiCmsKitPublicMenuItemsQueryKey(),
		});
	};

	const handleCreateOrUpdate = async (values: MenuItemFormValues) => {
		try {
			if (mode === "create") {
				await createMutation.mutateAsync({
					body: {
						displayName: values.displayName,
						isActive: values.isActive,
						url: values.url,
						icon: values.icon,
						target: values.target,
						elementId: values.elementId,
						cssClass: values.cssClass,
						pageId: values.pageId,
						requiredPermissionName: values.requiredPermissionName,
						parentId: values.parentId ?? null,
						order: values.order ?? 0,
					},
				});
				toast.success(MENU_ITEM_MESSAGES.CREATE_SUCCESS);
			} else if (menuItemId) {
				await updateMutation.mutateAsync({
					path: { id: menuItemId },
					body: {
						displayName: values.displayName,
						isActive: values.isActive,
						url: values.url,
						icon: values.icon,
						target: values.target,
						elementId: values.elementId,
						cssClass: values.cssClass,
						pageId: values.pageId,
						requiredPermissionName: values.requiredPermissionName,
						concurrencyStamp: editingItem?.concurrencyStamp,
					},
				});
				toast.success(MENU_ITEM_MESSAGES.UPDATE_SUCCESS);
			}
			invalidateMenuQueries();
			closeForm();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: MENU_ITEM_MESSAGES.ACTION_ERROR;
			toast.error(errorMessage);
			throw error;
		}
	};

	const handleDelete = async () => {
		if (!deleteId) return;
		try {
			await deleteMutation.mutateAsync({
				path: { id: deleteId },
			});
			invalidateMenuQueries();
			toast.success(MENU_ITEM_MESSAGES.DELETE_SUCCESS);
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: MENU_ITEM_MESSAGES.ACTION_ERROR;
			toast.error(errorMessage);
		} finally {
			setDeleteId(null);
		}
	};

	const handleMove = async (payload: {
		newParentId: string | null;
		position: number;
	}) => {
		if (!movingItem?.id) return;
		try {
			await moveMutation.mutateAsync({
				path: { id: movingItem.id },
				body: {
					newParentId: payload.newParentId,
					position: payload.position,
				},
			});
			invalidateMenuQueries();
			toast.success(MENU_ITEM_MESSAGES.MOVE_SUCCESS);
			closeMove();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: MENU_ITEM_MESSAGES.ACTION_ERROR;
			toast.error(errorMessage);
		}
	};

	const openRootCreate = () =>
		startCreate(null, getSiblingCount(adminItems, null));
	const openChildCreate = (item: MenuItemDto) =>
		startCreate(item.id ?? null, getSiblingCount(adminItems, item.id ?? null));

	const onEditItem = (item: MenuItemDto) => {
		if (!item.id) return;
		startEdit(item.id);
	};

	const onMoveItem = (item: MenuItemDto) => {
		if (!item.id) return;
		openMove(item.id, item.parentId ?? null);
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<div className="flex gap-2">
					<Button onClick={openRootCreate}>{MENU_ITEM_BUTTONS.ADD_ROOT}</Button>
					<Button
						variant="outline"
						onClick={() => adminQuery.refetch()}
						disabled={adminQuery.isFetching}
					>
						{MENU_ITEM_BUTTONS.REFRESH}
					</Button>
				</div>
				<Input
					placeholder={MENU_ITEM_SEARCH.PLACEHOLDER}
					value={searchTerm}
					onChange={(event) => setSearchTerm(event.target.value)}
					className="md:w-80"
				/>
			</div>

			{adminQuery.isError ? (
				<Alert variant="destructive">
					<AlertDescription>
						{adminQuery.error?.error?.message || MENU_ITEM_MESSAGES.LOAD_ERROR}
					</AlertDescription>
				</Alert>
			) : null}

			<div className="grid gap-4 lg:grid-cols-3">
				<div className="lg:col-span-1">
					<MenuItemsTree
						title={MENU_ITEMS_PAGE_COPY.SECTION_TREE}
						nodes={adminTree}
						isLoading={adminQuery.isLoading}
						emptyMessage={MENU_ITEM_EMPTY_STATES.NO_ITEMS}
					/>
				</div>
				<div className="lg:col-span-2 space-y-3">
					<Card className="p-2">
						<MenuItemsTable
							items={filteredItems}
							onAddChild={openChildCreate}
							onEdit={onEditItem}
							onMove={onMoveItem}
							onDelete={(item) => setDeleteId(item.id ?? null)}
							pageTitles={pageTitles}
							permissionLabels={permissionLabels}
							isLoading={adminQuery.isLoading}
						/>
					</Card>
				</div>
			</div>

			<MenuItemsTree
				title={MENU_ITEMS_PAGE_COPY.SECTION_PUBLIC}
				nodes={publicTree}
				isLoading={publicQuery.isLoading}
				emptyMessage={MENU_ITEM_EMPTY_STATES.NO_PUBLIC_ITEMS}
			/>

			<MenuItemForm
				open={open}
				mode={mode}
				initialValues={mode === "edit" ? editingItem : null}
				parentOptions={parentOptions}
				defaultOrder={defaultOrder}
				defaultParentId={parentId}
				onClose={closeForm}
				onSubmit={handleCreateOrUpdate}
				isSubmitting={createMutation.isPending || updateMutation.isPending}
			/>

			<MenuItemMoveDialog
				open={moveOpen}
				item={movingItem}
				tree={adminTree}
				allItems={adminItems}
				onClose={closeMove}
				onMove={({ newParentId, position }) =>
					handleMove({ newParentId, position })
				}
				isSubmitting={moveMutation.isPending}
			/>

			<AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{MENU_ITEM_BUTTONS.DELETE}</AlertDialogTitle>
						<AlertDialogDescription>
							{MENU_ITEM_MESSAGES.DELETE_CONFIRMATION}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>{MENU_ITEM_BUTTONS.CLOSE}</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							disabled={deleteMutation.isPending}
						>
							{MENU_ITEM_BUTTONS.DELETE}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
