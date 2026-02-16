import { IconPlus, IconBuilding } from "@tabler/icons-react";
import { Button } from "@/shared/components/ui/button";

interface TenantsHeaderProps {
	totalCount: number;
	onCreateTenant: () => void;
	isCreating: boolean;
}

export function TenantsHeader({
	totalCount,
	onCreateTenant,
	isCreating,
}: TenantsHeaderProps) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-2">
				<IconBuilding className="h-5 w-5" />
				<span className="text-sm text-muted-foreground">
					{totalCount} tenants total
				</span>
			</div>
			<Button
				onClick={onCreateTenant}
				disabled={isCreating}
				className="w-full sm:w-auto"
			>
				<IconPlus className="mr-2 h-4 w-4" />
				{isCreating ? "Creating..." : "Add Tenant"}
			</Button>
		</div>
	);
}
