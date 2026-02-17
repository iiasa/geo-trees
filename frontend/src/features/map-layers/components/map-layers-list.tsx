import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import {
	postApiAppMapLayerMutation,
	deleteApiAppMapLayerByIdMutation,
	getApiAppMapLayerOptions,
	getApiAppMapLayerQueryKey,
	putApiAppMapLayerByIdMutation,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import type { MapLayerDto } from "@/infrastructure/api/types.gen";
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
import { useMapLayerFormStore } from "../stores/map-layer-form-store";
import { MapLayerForm, type MapLayerFormData } from "./map-layer-form";
import { MapLayersHeader } from "./map-layers-header";
import { MapLayersTable } from "./map-layers-table";

export function MapLayersList() {
	const [sorting, setSorting] = useState([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [deleteLayerId, setDeleteLayerId] = useState<string | null>(null);
	const [searchValue, setSearchValue] = useState("");

	const queryOptions = {
		query: {
			MaxResultCount: pagination.pageSize,
			SkipCount: pagination.pageIndex * pagination.pageSize,
		},
	};
	const queryClient = useQueryClient();

	const {
		mapLayer: editingLayer,
		setLoading,
		openEditForm,
		openCreateForm,
		closeForm,
	} = useMapLayerFormStore();

	const {
		data: layersResponse,
		isLoading,
		error,
		isError,
	} = useQuery(getApiAppMapLayerOptions(queryOptions));

	const createLayerMutation = useMutation({
		...postApiAppMapLayerMutation(),
	});

	const updateLayerMutation = useMutation({
		...putApiAppMapLayerByIdMutation(),
	});

	const deleteLayerMutation = useMutation({
		...deleteApiAppMapLayerByIdMutation(),
	});

	const layers = layersResponse?.items || [];
	const totalCount = layersResponse?.totalCount || 0;

	const handleCreateLayer = async (data: MapLayerFormData) => {
		try {
			setLoading(true);
			await createLayerMutation.mutateAsync({
				body: {
					name: data.name,
					type: data.type as 0 | 1 | 2 | 3,
					url: data.url || null,
					sourceEndpoint: data.sourceEndpoint || null,
					layers: data.layers || null,
					format: data.format || null,
					isVisible: data.isVisible,
					legendUrl: data.legendUrl || null,
					attribution: data.attribution || null,
					order: data.order,
					groupName: data.groupName,
				},
			});
			queryClient.invalidateQueries({
				queryKey: getApiAppMapLayerQueryKey(queryOptions),
			});
			toast.success("Map layer created successfully");
			closeForm();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to create map layer";
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateLayer = async (data: MapLayerFormData) => {
		if (!editingLayer?.id) return;
		try {
			setLoading(true);
			await updateLayerMutation.mutateAsync({
				path: { id: editingLayer.id },
				body: {
					name: data.name,
					type: data.type as 0 | 1 | 2 | 3,
					url: data.url || null,
					sourceEndpoint: data.sourceEndpoint || null,
					layers: data.layers || null,
					format: data.format || null,
					isVisible: data.isVisible,
					legendUrl: data.legendUrl || null,
					attribution: data.attribution || null,
					order: data.order,
					groupName: data.groupName,
				},
			});
			await queryClient.invalidateQueries({
				queryKey: getApiAppMapLayerQueryKey(queryOptions),
			});
			await queryClient.refetchQueries({
				queryKey: getApiAppMapLayerQueryKey(queryOptions),
			});
			toast.success("Map layer updated successfully");
			closeForm();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to update map layer";
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteLayer = async (layerId: string) => {
		try {
			await deleteLayerMutation.mutateAsync({
				path: { id: layerId },
			});
			queryClient.invalidateQueries({
				queryKey: getApiAppMapLayerQueryKey(queryOptions),
			});
			toast.success("Map layer deleted successfully");
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to delete map layer";
			toast.error(errorMessage);
			throw error;
		}
	};

	const handleConfirmDelete = async () => {
		if (deleteLayerId) {
			await handleDeleteLayer(deleteLayerId);
		}
		setDeleteLayerId(null);
	};

	const handleEditLayer = (layer: MapLayerDto) => {
		openEditForm(layer);
	};

	const handleCreateNewLayer = () => {
		openCreateForm();
	};

	const handleOpenDeleteDialog = (layerId: string) => {
		setDeleteLayerId(layerId);
	};

	if (isError) {
		return (
			<Alert variant="destructive">
				<AlertDescription>
					Failed to load map layers: {error?.error?.message || "Unknown error"}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-4">
			<MapLayersHeader
				totalCount={totalCount}
				onCreateLayer={handleCreateNewLayer}
				isCreating={createLayerMutation.isPending}
				onSearchChange={(value: string) => setSearchValue(value)}
				searchValue={searchValue}
			/>

			<MapLayersTable
				layers={layers}
				isLoading={isLoading}
				sorting={sorting}
				pagination={pagination}
				totalCount={totalCount}
				onSortingChange={(sorting) => setSorting(sorting)}
				onPaginationChange={(pagination) => setPagination(pagination)}
				onEditLayer={handleEditLayer}
				onDeleteLayer={handleOpenDeleteDialog}
				isDeleting={deleteLayerMutation.isPending}
			/>

			<MapLayerForm
				key={editingLayer?.id || "create"}
				mapLayer={editingLayer}
				onSubmit={editingLayer ? handleUpdateLayer : handleCreateLayer}
				isLoading={
					createLayerMutation.isPending || updateLayerMutation.isPending
				}
				mode={editingLayer ? "edit" : "create"}
			/>

			<AlertDialog
				open={!!deleteLayerId}
				onOpenChange={() => setDeleteLayerId(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Map Layer</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this map layer? This action cannot
							be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							data-testid="confirm-delete-btn"
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
