import {
	closestCenter,
	type DragEndEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	type UniqueIdentifier,
	useSensor,
	useSensors,
	DndContext,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
	IconChevronDown,
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
	IconLayoutColumns,
} from "@tabler/icons-react";
import {
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/table";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/shared/components/ui/tabs";
import { columns, DraggableRow } from "./columns";
import type { DataTableSchema } from "./types";

export function DataTable({ data: initialData }: { data: DataTableSchema[] }) {
	const [data, setData] = React.useState(() => initialData);
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const sortableId = React.useId();
	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {}),
	);

	const dataIds = React.useMemo<UniqueIdentifier[]>(
		() => data?.map(({ id }) => id) || [],
		[data],
	);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination,
		},
		getRowId: (row) => row.id.toString(),
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			setData((data) => {
				const oldIndex = dataIds.indexOf(active.id);
				const newIndex = dataIds.indexOf(over.id);
				return arrayMove(data, oldIndex, newIndex);
			});
		}
	}

	return (
		<Tabs
			defaultValue="outline"
			className="w-full flex-col justify-start gap-6"
		>
			<div className="flex items-center justify-between px-4 lg:px-6">
				<Label htmlFor="view-selector" className="sr-only">
					View
				</Label>
				<TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
					<TabsTrigger value="outline">Outline</TabsTrigger>
					<TabsTrigger value="past-performance">Past Performance</TabsTrigger>
					<TabsTrigger value="key-personnel">Key Personnel</TabsTrigger>
					<TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
				</TabsList>
				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								<IconLayoutColumns />
								<span className="hidden lg:inline">Customize Columns</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							{table
								.getAllColumns()
								.filter(
									(column) =>
										typeof column.accessorFn !== "undefined" ||
										column.id === "select",
								)
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id === "select"
												? "Checkbox"
												: column.id === "drag"
													? "Drag"
													: column.id === "actions"
														? "Actions"
														: column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<TabsContent
				value="outline"
				className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
			>
				<div className="flex items-center gap-2 py-4">
					<Input
						placeholder="Filter headers..."
						value={
							(table.getColumn("header")?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table.getColumn("header")?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
					<div className="ml-auto flex items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm">
									<IconChevronDown />
									<span className="hidden sm:inline">View</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-40">
								<DropdownMenuCheckboxItem
									checked={table.getIsAllPageRowsSelected()}
									onCheckedChange={(value) =>
										table.toggleAllPageRowsSelected(!!value)
									}
								>
									Select All
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem
									checked={table.getIsSomePageRowsSelected()}
									onCheckedChange={(value) =>
										table.toggleAllPageRowsSelected(!!value)
									}
								>
									Deselect All
								</DropdownMenuCheckboxItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
				<div className="rounded-md border">
					<DndContext
						collisionDetection={closestCenter}
						modifiers={[restrictToVerticalAxis]}
						onDragEnd={handleDragEnd}
						sensors={sensors}
						id={sortableId}
					>
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<TableHead
												key={header.id}
												data-testid={
													header.id === "header" ? "table-header-id" : undefined
												}
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										))}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								<SortableContext
									items={dataIds}
									strategy={verticalListSortingStrategy}
								>
									{table.getRowModel().rows?.length ? (
										table
											.getRowModel()
											.rows.map((row) => (
												<DraggableRow key={row.id} row={row} />
											))
									) : (
										<TableRow>
											<TableCell
												colSpan={columns.length}
												className="h-24 text-center"
											>
												No results.
											</TableCell>
										</TableRow>
									)}
								</SortableContext>
							</TableBody>
						</Table>
					</DndContext>
				</div>
				<div className="flex items-center justify-between space-x-2 py-4">
					<div className="text-sm text-muted-foreground flex-1">
						{table.getFilteredSelectedRowModel().rows.length} of{" "}
						{table.getFilteredRowModel().rows.length} row(s) selected.
					</div>
					<div className="flex items-center space-x-6 lg:space-x-8">
						<div className="flex items-center space-x-2">
							<p className="text-sm font-medium">Rows per page</p>
							<Select
								value={`${pagination.pageSize}`}
								onValueChange={(value) => {
									setPagination({
										...pagination,
										pageSize: Number(value),
									});
								}}
							>
								<SelectTrigger className="h-8 w-[70px]">
									<SelectValue placeholder={pagination.pageSize} />
								</SelectTrigger>
								<SelectContent side="top">
									{[10, 20, 30, 40, 50].map((pageSize) => (
										<SelectItem key={pageSize} value={`${pageSize}`}>
											{pageSize}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex w-[100px] items-center justify-center text-sm font-medium">
							Page {pagination.pageIndex + 1} of {table.getPageCount()}
						</div>
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => {
									setPagination({
										...pagination,
										pageIndex: 0,
									});
								}}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Go to first page</span>
								<IconChevronsLeft />
							</Button>
							<Button
								variant="outline"
								className="h-8 w-8 p-0"
								onClick={() => {
									setPagination({
										...pagination,
										pageIndex: pagination.pageIndex - 1,
									});
								}}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Go to previous page</span>
								<IconChevronLeft />
							</Button>
							<Button
								variant="outline"
								className="h-8 w-8 p-0"
								onClick={() => {
									setPagination({
										...pagination,
										pageIndex: pagination.pageIndex + 1,
									});
								}}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Go to next page</span>
								<IconChevronRight />
							</Button>
							<Button
								variant="outline"
								className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => {
									setPagination({
										...pagination,
										pageIndex: table.getPageCount() - 1,
									});
								}}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Go to last page</span>
								<IconChevronsRight />
							</Button>
						</div>
					</div>
				</div>
			</TabsContent>
			<TabsContent
				value="past-performance"
				className="flex flex-col gap-4 px-4 lg:px-6"
			>
				<div className="aspect-video bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground">
					Past Performance view content
				</div>
			</TabsContent>
			<TabsContent
				value="key-personnel"
				className="flex flex-col gap-4 px-4 lg:px-6"
			>
				<div className="aspect-video bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground">
					Key Personnel view content
				</div>
			</TabsContent>
			<TabsContent
				value="focus-documents"
				className="flex flex-col gap-4 px-4 lg:px-6"
			>
				<div className="aspect-video bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground">
					Focus Documents view content
				</div>
			</TabsContent>
		</Tabs>
	);
}
