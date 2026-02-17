import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { MapLayerDto } from "@/infrastructure/api/types.gen";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { TableRenderer } from "@/shared/components/ui/table-renderer";

const MAP_LAYER_TYPE_LABELS: Record<number, string> = {
	0: "WMS",
	1: "BackendGeoJson",
	2: "ExternalGeoJson",
	3: "TileJSON",
};

function getLayerTypeLabel(type?: number): string {
	if (type === undefined || type === null) return "Unknown";
	return MAP_LAYER_TYPE_LABELS[type] ?? "Unknown";
}

interface MapLayersTableProps {
	layers: MapLayerDto[];
	totalCount: number;
	isLoading: boolean;
	sorting: never[];
	pagination: {
		pageIndex: number;
		pageSize: number;
	};
	onSortingChange: (sorting: never[]) => void;
	onPaginationChange: (pagination: {
		pageIndex: number;
		pageSize: number;
	}) => void;
	onEditLayer: (layer: MapLayerDto) => void;
	onDeleteLayer: (layerId: string) => void;
	isDeleting: boolean;
}

export function MapLayersTable({
	layers,
	totalCount,
	isLoading,
	sorting: _sorting,
	pagination,
	onSortingChange: _onSortingChange,
	onPaginationChange,
	onEditLayer,
	onDeleteLayer,
	isDeleting,
}: MapLayersTableProps) {
	const columns: ColumnDef<MapLayerDto>[] = [
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
		},
		{
			accessorKey: "type",
			header: "Type",
			cell: ({ row }) => (
				<Badge variant="outline">{getLayerTypeLabel(row.original.type)}</Badge>
			),
		},
		{
			accessorKey: "groupName",
			header: "Group Name",
			cell: ({ row }) => <div>{row.original.groupName || "-"}</div>,
		},
		{
			accessorKey: "order",
			header: "Order",
			cell: ({ row }) => <div>{row.original.order ?? 0}</div>,
		},
		{
			accessorKey: "isVisible",
			header: "Visible",
			cell: ({ row }) => (
				<Badge variant={row.original.isVisible ? "default" : "secondary"}>
					{row.original.isVisible ? "Visible" : "Hidden"}
				</Badge>
			),
		},
		{
			id: "actions",
			cell: ({ row }) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="h-8 w-8 p-0"
							data-testid="layer-actions-trigger"
						>
							<span className="sr-only">Open menu</span>
							<IconDots className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => onEditLayer(row.original)}
							data-testid="edit-layer-btn"
						>
							<IconPencil className="mr-2 h-4 w-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive"
							disabled={isDeleting}
							data-testid="delete-layer-btn"
							onClick={() => {
								if (row.original.id) {
									onDeleteLayer(row.original.id);
								}
							}}
						>
							<IconTrash className="mr-2 h-4 w-4" />
							{isDeleting ? "Deleting..." : "Delete"}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			),
		},
	];

	if (isLoading) {
		return (
			<div className="space-y-3">
				{Array.from({ length: 5 }, (_, index) => {
					const uniqueId = `skeleton-layer-${Date.now()}-${index}`;
					return (
						<div key={uniqueId} className="flex items-center space-x-4 p-4">
							<div className="h-4 w-32 bg-muted animate-pulse rounded" />
							<div className="h-4 w-24 bg-muted animate-pulse rounded" />
						</div>
					);
				})}
			</div>
		);
	}

	return (
		<TableRenderer
			data={layers}
			columns={columns}
			pagination={pagination}
			totalCount={totalCount}
			onPaginationChange={onPaginationChange}
			tableTestId="map-layers-table"
			rowTestId="map-layer-row"
		/>
	);
}
