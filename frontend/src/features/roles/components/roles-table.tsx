import {
	IconDots,
	IconPencil,
	IconShield,
	IconTrash,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { IdentityRoleDto } from "@/infrastructure/api/types.gen";
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

interface RolesTableProps {
	roles: IdentityRoleDto[];
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
	onEditRole: (role: IdentityRoleDto) => void;
	onOpenPermissions: (role: IdentityRoleDto) => void;
	onDeleteRole: (roleId: string) => void;
	isDeleting: boolean;
}

export function RolesTable({
	roles,
	totalCount,
	isLoading,
	sorting: _sorting,
	pagination,
	onSortingChange: _onSortingChange,
	onPaginationChange,
	onEditRole,
	onOpenPermissions,
	onDeleteRole,
	isDeleting,
}: RolesTableProps) {
	const handleEditRole = (role: IdentityRoleDto) => {
		onEditRole(role);
	};

	const handleOpenPermissions = (role: IdentityRoleDto) => {
		onOpenPermissions(role);
	};

	const handleDeleteRole = (roleId: string) => {
		onDeleteRole(roleId);
	};

	const columns: ColumnDef<IdentityRoleDto>[] = [
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) => <div>{row.original.name || "-"}</div>,
		},
		{
			accessorKey: "isStatic",
			header: "Static",
			cell: ({ row }) => (
				<Badge variant={row.original.isStatic ? "default" : "secondary"}>
					{row.original.isStatic ? "Static" : "Dynamic"}
				</Badge>
			),
		},
		{
			accessorKey: "isDefault",
			header: "Default",
			cell: ({ row }) => (
				<Badge variant={row.original.isDefault ? "default" : "secondary"}>
					{row.original.isDefault ? "Default" : "Not Default"}
				</Badge>
			),
		},
		{
			accessorKey: "creationTime",
			header: "Created",
			cell: ({ row }) => (
				<div className="text-sm text-muted-foreground">
					{row.original.creationTime
						? new Date(row.original.creationTime).toLocaleDateString()
						: "-"}
				</div>
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
							data-testid="role-actions-trigger"
						>
							<span className="sr-only">Open menu</span>
							<IconDots className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => handleEditRole(row.original)}>
							<IconPencil className="mr-2 h-4 w-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleOpenPermissions(row.original)}
							data-testid="edit-permissions-btn"
						>
							<IconShield className="mr-2 h-4 w-4" />
							Permissions
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive"
							disabled={isDeleting || row.original.isStatic}
							data-testid="delete-role-btn"
							onClick={() => {
								if (row.original.id) {
									handleDeleteRole(row.original.id);
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
					const uniqueId = `skeleton-role-${Date.now()}-${index}`;
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
			data={roles}
			columns={columns}
			pagination={pagination}
			totalCount={totalCount}
			onPaginationChange={onPaginationChange}
			tableTestId="roles-table"
			rowTestId="role-row"
		/>
	);
}
