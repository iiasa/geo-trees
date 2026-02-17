import {
	IconDots,
	IconEye,
	IconHome,
	IconPencil,
	IconTrash,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { VoloCmsKitAdminPagesPageDto } from "@/infrastructure/api/types.gen";
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
import { PAGE_BUTTON_LABELS, PAGE_PUBLIC_BASE_PATH } from "../constants";

interface PagesTableProps {
	pages: VoloCmsKitAdminPagesPageDto[];
	totalCount: number;
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
	onEditPage: (page: VoloCmsKitAdminPagesPageDto) => void;
	onDeletePage: (pageId: string) => void;
	onSetAsHomepage: (pageId: string) => void;
	isDeleting: boolean;
	selectedPages: string[];
	onSelectedPagesChange: (pageIds: string[]) => void;
}

export function PagesTable({
	pages,
	totalCount,
	sorting: _sorting,
	pagination,
	onSortingChange: _onSortingChange,
	onPaginationChange,
	onEditPage,
	onDeletePage,
	onSetAsHomepage,
	isDeleting,
	selectedPages,
	onSelectedPagesChange,
}: PagesTableProps) {
	const handleEditPage = (page: VoloCmsKitAdminPagesPageDto) => {
		onEditPage(page);
	};

	const handleDeletePage = (pageId: string) => {
		onDeletePage(pageId);
	};

	const handleSetAsHomepage = (pageId: string) => {
		onSetAsHomepage(pageId);
	};

	const handleViewPage = (slug: string) => {
		if (!slug) return;
		window.open(`${PAGE_PUBLIC_BASE_PATH}/${slug}`, "_blank");
	};

	const columns: ColumnDef<VoloCmsKitAdminPagesPageDto>[] = [
		{
			id: "select",
			header: ({ table: _table }) => (
				<Checkbox
					checked={
						selectedPages.length === pages.length && pages.length > 0
							? true
							: selectedPages.length === 0
								? false
								: "indeterminate"
					}
					onCheckedChange={(checked) => {
						if (onSelectedPagesChange) {
							if (checked === true) {
								const allPageIds = pages
									.map((page) => page.id || "")
									.filter(Boolean);
								onSelectedPagesChange(allPageIds);
							} else {
								onSelectedPagesChange([]);
							}
						}
					}}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={selectedPages.includes(row.original.id || "")}
					onCheckedChange={(checked) => {
						if (onSelectedPagesChange) {
							if (checked) {
								onSelectedPagesChange([
									...selectedPages,
									row.original.id || "",
								]);
							} else {
								onSelectedPagesChange(
									selectedPages.filter((id) => id !== row.original.id),
								);
							}
						}
					}}
					data-testid="page-checkbox"
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "title",
			header: "Title",
			cell: ({ row }) => (
				<div className="font-medium">{row.original.title}</div>
			),
		},
		{
			accessorKey: "slug",
			header: "Slug",
			cell: ({ row }) => (
				<div className="font-mono text-sm text-muted-foreground">
					{row.original.slug
						? `${PAGE_PUBLIC_BASE_PATH}/${row.original.slug}`
						: "-"}
				</div>
			),
		},
		{
			accessorKey: "creationTime",
			header: "Created",
			cell: ({ row }) => (
				<div className="text-sm">
					{row.original.creationTime
						? new Date(row.original.creationTime).toLocaleDateString()
						: "-"}
				</div>
			),
		},
		{
			accessorKey: "lastModificationTime",
			header: "Last Modified",
			cell: ({ row }) => (
				<div className="text-sm">
					{row.original.lastModificationTime
						? new Date(row.original.lastModificationTime).toLocaleDateString()
						: "-"}
				</div>
			),
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const page = row.original;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="h-8 w-8 p-0"
								data-testid="btn-page-actions"
							>
								<span className="sr-only">Open menu</span>
								<IconDots className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => handleViewPage(page.slug || "")}
								data-testid="btn-view-page"
							>
								<IconEye className="mr-2 h-4 w-4" />
								{PAGE_BUTTON_LABELS.VIEW}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleEditPage(page)}
								data-testid="btn-edit-page"
							>
								<IconPencil className="mr-2 h-4 w-4" />
								{PAGE_BUTTON_LABELS.EDIT}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleSetAsHomepage(page.id || "")}
								data-testid="btn-set-homepage"
							>
								<IconHome className="mr-2 h-4 w-4" />
								{PAGE_BUTTON_LABELS.SET_HOMEPAGE}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => handleDeletePage(page.id || "")}
								disabled={isDeleting}
								className="text-destructive focus:text-destructive"
								data-testid="btn-delete-page"
							>
								<IconTrash className="mr-2 h-4 w-4" />
								{PAGE_BUTTON_LABELS.DELETE}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	return (
		<TableRenderer
			data={pages}
			columns={columns}
			pagination={pagination}
			onPaginationChange={onPaginationChange}
			totalCount={totalCount}
		/>
	);
}
