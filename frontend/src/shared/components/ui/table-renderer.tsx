import type {
	ColumnDef,
	CellContext,
	HeaderContext,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { useIsMobile } from "@/shared/hooks/use-mobile";

interface TableRendererProps<TData> {
	data: TData[];
	columns: ColumnDef<TData>[];
	pagination: {
		pageIndex: number;
		pageSize: number;
	};
	totalCount: number;
	onPaginationChange: (pagination: {
		pageIndex: number;
		pageSize: number;
	}) => void;
	tableTestId?: string;
	rowTestId?: string;
}

export function TableRenderer<TData>({
	data,
	columns,
	pagination,
	totalCount,
	onPaginationChange,
	tableTestId,
	rowTestId,
}: TableRendererProps<TData>) {
	const isMobile = useIsMobile();
	const totalPages = Math.ceil(totalCount / pagination.pageSize);
	const canPreviousPage = pagination.pageIndex > 0;
	const canNextPage = pagination.pageIndex < totalPages - 1;

	// Filter out select and actions columns for mobile card view
	const displayColumns = columns.filter(
		(col) => col.id !== "select" && col.id !== "actions",
	);
	const actionsColumn = columns.find((col) => col.id === "actions");

	// Get cell content helper
	const getCellContent = (
		column: ColumnDef<TData>,
		row: TData,
		rowIndex: number,
	): React.ReactNode => {
		if (typeof column.cell === "function") {
			try {
				const cellContext = {
					row: {
						original: row,
						index: rowIndex,
					},
				} as CellContext<TData, unknown>;
				return column.cell(cellContext);
			} catch {
				return "";
			}
		} else if (column.cell) {
			return column.cell;
		} else if (column.header) {
			return typeof column.header === "function"
				? column.header({
						column,
						header: column,
					} as HeaderContext<TData, unknown>)
				: column.header;
		}
		return "";
	};

	// Get header text helper
	const getHeaderText = (column: ColumnDef<TData>): string => {
		if (typeof column.header === "function") {
			return "";
		}
		return (column.header as string) || "";
	};

	return (
		<div className="space-y-4">
			{isMobile ? (
				// Mobile card view
				<div className="space-y-3" data-testid={tableTestId}>
					{data.length === 0 ? (
						<Card>
							<CardContent className="py-8 text-center text-muted-foreground">
								No results.
							</CardContent>
						</Card>
					) : (
						data.map((row, index) => (
							<Card
								key={`mobile-row-${index}-${JSON.stringify(row)}`}
								data-testid={rowTestId}
								className="overflow-hidden"
							>
								<CardContent className="p-4 space-y-3">
									{displayColumns.map((column, colIndex) => {
										const headerText = getHeaderText(column);
										const cellContent = getCellContent(column, row, index);

										// Skip empty cells
										if (!headerText && !cellContent) return null;

										return (
											<div
												key={
													(column.id as string) ||
													("accessorKey" in column
														? (column.accessorKey as string)
														: undefined) ||
													`mobile-cell-${index}-${colIndex}`
												}
												className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
											>
												{headerText && (
													<span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
														{headerText}
													</span>
												)}
												<div className="text-sm font-medium text-foreground">
													{cellContent}
												</div>
											</div>
										);
									})}
									{actionsColumn && (
										<div className="pt-2 border-t flex justify-end">
											{getCellContent(actionsColumn, row, index)}
										</div>
									)}
								</CardContent>
							</Card>
						))
					)}
				</div>
			) : (
				// Desktop table view
				<div className="rounded-md border overflow-x-auto">
					<Table data-testid={tableTestId} className="min-w-[640px]">
						<TableHeader>
							<TableRow>
								{columns.map((column, index) => (
									<TableHead
										key={
											(column.id as string) ||
											("accessorKey" in column
												? (column.accessorKey as string)
												: undefined) ||
											`column-${index}`
										}
									>
										{typeof column.header === "function"
											? column.header({
													column,
													header: column,
												} as HeaderContext<TData, unknown>)
											: (column.header as string)}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.map((row, index) => (
								<TableRow
									key={`row-${index}-${JSON.stringify(row)}`}
									data-testid={rowTestId}
								>
									{columns.map((column, colIndex) => {
										const cellContent = getCellContent(column, row, index);
										return (
											<TableCell
												key={
													(column.id as string) ||
													("accessorKey" in column
														? (column.accessorKey as string)
														: undefined) ||
													`cell-${index}-${colIndex}`
												}
											>
												{cellContent}
											</TableCell>
										);
									})}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			{/* Pagination */}
			<div
				className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2"
				data-testid="users-pagination"
			>
				<div className="flex-1 text-sm text-muted-foreground">
					Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
					{Math.min(
						(pagination.pageIndex + 1) * pagination.pageSize,
						totalCount,
					)}{" "}
					of {totalCount} entries
				</div>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:space-x-6 lg:space-x-8">
					<div className="flex items-center space-x-2">
						<p className="text-sm font-medium hidden sm:block">Rows per page</p>
						<p className="text-sm font-medium sm:hidden">Rows</p>
						<Select
							value={`${pagination.pageSize}`}
							onValueChange={(value) =>
								onPaginationChange({
									...pagination,
									pageSize: Number(value),
								})
							}
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

					<div
						className="flex w-auto sm:w-[100px] items-center justify-center text-sm font-medium"
						data-testid="current-page"
					>
						Page {pagination.pageIndex + 1} of {totalPages}
					</div>

					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() =>
								onPaginationChange({
									...pagination,
									pageIndex: 0,
								})
							}
							disabled={!canPreviousPage}
						>
							<span className="sr-only">Go to first page</span>
							<IconChevronLeft className="h-4 w-4" />
							<IconChevronLeft className="h-4 w-4 -translate-x-2" />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() =>
								onPaginationChange({
									...pagination,
									pageIndex: pagination.pageIndex - 1,
								})
							}
							disabled={!canPreviousPage}
						>
							<span className="sr-only">Go to previous page</span>
							<IconChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							data-testid="next-page-btn"
							onClick={() =>
								onPaginationChange({
									...pagination,
									pageIndex: pagination.pageIndex + 1,
								})
							}
							disabled={!canNextPage}
						>
							<span className="sr-only">Go to next page</span>
							<IconChevronRight className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() =>
								onPaginationChange({
									...pagination,
									pageIndex: totalPages - 1,
								})
							}
							disabled={!canNextPage}
						>
							<span className="sr-only">Go to last page</span>
							<IconChevronRight className="h-4 w-4" />
							<IconChevronRight className="h-4 w-4 translate-x-2" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
