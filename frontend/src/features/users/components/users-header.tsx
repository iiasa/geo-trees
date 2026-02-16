import { IconPlus, IconUsers } from "@tabler/icons-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface UsersHeaderProps {
	totalCount: number;
	onCreateUser: () => void;
	isCreating: boolean;
	searchValue?: string;
	onSearchChange?: (value: string) => void;
}

export function UsersHeader({
	totalCount,
	onCreateUser,
	isCreating,
	searchValue = "",
	onSearchChange,
}: UsersHeaderProps) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-2">
				<IconUsers className="h-5 w-5" />
				<span className="text-sm text-muted-foreground">
					{totalCount} users total
				</span>
			</div>
			<div
				className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
				suppressHydrationWarning
			>
				{onSearchChange && (
					<Input
						placeholder="Search users..."
						value={searchValue}
						onChange={(e) => onSearchChange(e.target.value)}
						className="w-full sm:w-64"
						data-testid="field-user-search"
						suppressHydrationWarning
					/>
				)}
				<Button
					onClick={onCreateUser}
					disabled={isCreating}
					data-testid="btn-create-user"
					className="w-full sm:w-auto"
				>
					<IconPlus className="mr-2 h-4 w-4" />
					{isCreating ? "Creating..." : "Add User"}
				</Button>
			</div>
		</div>
	);
}
