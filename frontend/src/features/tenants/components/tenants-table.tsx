import {
	IconDots,
	IconPencil,
	IconTrash,
	IconDatabase,
	IconShield,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { TenantDto } from "@/infrastructure/api/types.gen";
import { Button } from "@/shared/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { TableRenderer } from "@/shared/components/ui/table-renderer";

interface TenantsTableProps {
	tenants: TenantDto[];
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
	onEditTenant: (tenant: TenantDto) => void;
	onOpenConnectionString: (tenant: TenantDto) => void;
	onManageFeatures: (tenant: TenantDto) => void;
	onDeleteTenant: (tenantId: string) => void;
	isDeleting: boolean;
}

export function TenantsTable({
	tenants,
	totalCount,
	isLoading,
	sorting: _sorting,
	pagination,
	onSortingChange: _onSortingChange,
	onPaginationChange,
	onEditTenant,
	onOpenConnectionString,
	onManageFeatures,
	onDeleteTenant,
	isDeleting,
}: TenantsTableProps) {
	const handleEditTenant = (tenant: TenantDto) => {
		onEditTenant(tenant);
	};

	const handleOpenConnection = (tenant: TenantDto) => {
		onOpenConnectionString(tenant);
	};

	const handleDeleteTenant = (tenantId: string) => {
		onDeleteTenant(tenantId);
	};

	const columns: ColumnDef<TenantDto>[] = [
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) => (
				<div className="font-medium">{row.original.name || "-"}</div>
			),
		},
		{
			accessorKey: "id",
			header: "ID",
			cell: ({ row }) => <div>{row.original.id || "-"}</div>,
		},
		{
			id: "actions",
			cell: ({ row }) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<IconDots className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => handleEditTenant(row.original)}>
							<IconPencil className="mr-2 h-4 w-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onManageFeatures(row.original)}>
							<IconShield className="mr-2 h-4 w-4" />
							Features
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleOpenConnection(row.original)}
						>
							<IconDatabase className="mr-2 h-4 w-4" />
							Connection String
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive"
							disabled={isDeleting}
							onClick={() => {
								if (confirm("Are you sure you want to delete this tenant?")) {
									if (row.original.id) {
										handleDeleteTenant(row.original.id);
									}
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
					const uniqueId = `skeleton-tenant-${Date.now()}-${index}`;
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
			data={tenants}
			columns={columns}
			pagination={pagination}
			totalCount={totalCount}
			onPaginationChange={onPaginationChange}
		/>
	);
}
