import type { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@/shared/hooks/use-mobile";
import { TableRenderer } from "./table-renderer";
import { Skeleton } from "./skeleton";

interface DataTableProps<TData> {
	data: TData[];
	columns: ColumnDef<TData>[];
	totalCount: number;
	isError?: boolean;
	error?: Error | null;
}

export function DataTable<TData>({
	data,
	columns,
	totalCount,
	isError = false,
	error = null,
}: DataTableProps<TData>) {
	const {
		loading,
		error: tableError,
		pagination,
		setPagination,
	} = useTable<TData>(data);

	if (loading) {
		return (
			<div className="space-y-3">
				{Array.from({ length: 5 }).map((_, index) => {
					const uniqueId = `skeleton-${Date.now()}-${index}`;
					return (
						<div key={uniqueId} className="flex items-center space-x-4 p-4">
							<Skeleton className="h-12 w-12 rounded-full" />
							<div className="space-y-2 flex-1">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
							</div>
						</div>
					);
				})}
			</div>
		);
	}

	if (isError || tableError) {
		return (
			<div className="flex flex-col items-center justify-center h-96">
				<div className="text-center">
					<h3 className="text-lg font-medium">Error loading data</h3>
					<p className="text-sm text-muted-foreground">
						{error?.message || tableError || "Unknown error occurred"}
					</p>
				</div>
			</div>
		);
	}

	return (
		<TableRenderer
			data={data}
			columns={columns}
			pagination={pagination}
			totalCount={totalCount}
			onPaginationChange={setPagination}
		/>
	);
}
