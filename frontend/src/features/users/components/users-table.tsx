import {
	IconDots,
	IconPencil,
	IconShield,
	IconTrash,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { IdentityUserDto } from "@/infrastructure/api/types.gen";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { TableRenderer } from "@/shared/components/ui/table-renderer";

interface UsersTableProps {
	users: IdentityUserDto[];
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
	onEditUser: (user: IdentityUserDto) => void;
	onOpenPermissions: (user: IdentityUserDto) => void;
	onDeleteUser: (userId: string) => void;
	isDeleting: boolean;
	selectedUsers: string[];
	onSelectedUsersChange: (userIds: string[]) => void;
}

export function UsersTable({
	users,
	totalCount,
	isLoading,
	sorting: _sorting,
	pagination,
	onSortingChange: _onSortingChange,
	onPaginationChange,
	onEditUser,
	onOpenPermissions,
	onDeleteUser,
	isDeleting,
	selectedUsers,
	onSelectedUsersChange,
}: UsersTableProps) {
	const handleEditUser = (user: IdentityUserDto) => {
		onEditUser(user);
	};

	const handleOpenPermissions = (user: IdentityUserDto) => {
		onOpenPermissions(user);
	};

	const handleDeleteUser = (userId: string) => {
		onDeleteUser(userId);
	};

	const columns: ColumnDef<IdentityUserDto>[] = [
		{
			id: "select",
			header: ({ table: _table }) => (
				<Checkbox
					checked={
						selectedUsers.length === users.length && users.length > 0
							? true
							: selectedUsers.length === 0
								? false
								: "indeterminate"
					}
					onCheckedChange={(checked) => {
						if (onSelectedUsersChange) {
							if (checked === true) {
								const allUserIds = users
									.map((user) => user.id || "")
									.filter(Boolean);
								onSelectedUsersChange(allUserIds);
							} else {
								onSelectedUsersChange([]);
							}
						}
					}}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={selectedUsers.includes(row.original.id || "")}
					onCheckedChange={(checked) => {
						if (onSelectedUsersChange) {
							if (checked) {
								onSelectedUsersChange([
									...selectedUsers,
									row.original.id || "",
								]);
							} else {
								onSelectedUsersChange(
									selectedUsers.filter((id) => id !== row.original.id),
								);
							}
						}
					}}
					data-testid="user-checkbox"
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "userName",
			header: "Username",
			cell: ({ row }) => (
				<div className="font-medium">{row.original.userName}</div>
			),
		},
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) => (
				<div>
					{row.original.name} {row.original.surname}
				</div>
			),
		},
		{
			accessorKey: "email",
			header: "Email",
			cell: ({ row }) => <div>{row.original.email}</div>,
		},
		{
			accessorKey: "phoneNumber",
			header: "Phone",
			cell: ({ row }) => <div>{row.original.phoneNumber || "-"}</div>,
		},
		{
			accessorKey: "isActive",
			header: "Status",
			cell: ({ row }) => (
				<Badge variant={row.original.isActive ? "default" : "secondary"}>
					{row.original.isActive ? "Active" : "Inactive"}
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
							data-testid="user-actions-trigger"
						>
							<span className="sr-only">Open menu</span>
							<IconDots className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => handleEditUser(row.original)}
							data-testid="edit-user-btn"
						>
							<IconPencil className="mr-2 h-4 w-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleOpenPermissions(row.original)}
						>
							<IconShield className="mr-2 h-4 w-4" />
							Permissions
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive"
							disabled={isDeleting}
							data-testid="delete-user-btn"
							onClick={() => {
								if (row.original.id) {
									handleDeleteUser(row.original.id);
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
					const uniqueId = `skeleton-user-${Date.now()}-${index}`;
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
			data={users}
			columns={columns}
			pagination={pagination}
			totalCount={totalCount}
			onPaginationChange={onPaginationChange}
			tableTestId="users-table"
			rowTestId="user-row"
		/>
	);
}
