import { IconLayersSubtract, IconPlus } from "@tabler/icons-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface MapLayersHeaderProps {
	totalCount: number;
	onCreateLayer: () => void;
	isCreating: boolean;
	searchValue?: string;
	onSearchChange?: (value: string) => void;
}

export function MapLayersHeader({
	totalCount,
	onCreateLayer,
	isCreating,
	searchValue = "",
	onSearchChange,
}: MapLayersHeaderProps) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-2">
				<IconLayersSubtract className="h-5 w-5" />
				<span className="text-sm text-muted-foreground">
					{totalCount} layers total
				</span>
			</div>
			<div
				className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
				suppressHydrationWarning
			>
				{onSearchChange && (
					<Input
						placeholder="Search layers..."
						value={searchValue}
						onChange={(e) => onSearchChange(e.target.value)}
						className="w-full sm:w-64"
						data-testid="field-layer-search"
						suppressHydrationWarning
					/>
				)}
				<Button
					onClick={onCreateLayer}
					disabled={isCreating}
					data-testid="btn-create-layer"
					className="w-full sm:w-auto"
				>
					<IconPlus className="mr-2 h-4 w-4" />
					{isCreating ? "Creating..." : "Add Layer"}
				</Button>
			</div>
		</div>
	);
}
