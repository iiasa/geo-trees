import { IconPlus, IconShield } from "@tabler/icons-react";
import { Button } from "@/shared/components/ui/button";

interface RolesHeaderProps {
	totalCount: number;
	onCreateRole: () => void;
	isCreating: boolean;
}

export function RolesHeader({
	totalCount,
	onCreateRole,
	isCreating,
}: RolesHeaderProps) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-2">
				<IconShield className="h-5 w-5" />
				<span className="text-sm text-muted-foreground">
					{totalCount} roles total
				</span>
			</div>
			<Button
				onClick={onCreateRole}
				disabled={isCreating}
				data-testid="btn-create-role"
				className="w-full sm:w-auto"
			>
				<IconPlus className="mr-2 h-4 w-4" />
				{isCreating ? "Creating..." : "Add Role"}
			</Button>
		</div>
	);
}
