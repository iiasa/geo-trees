import { IconFile, IconPlus } from "@tabler/icons-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { PermissionGuard } from "@/shared/components/permission-guard";
import { CMS_PERMISSIONS } from "@/shared/hooks/use-permissions";
import { PAGE_BUTTON_LABELS } from "../constants";

interface PagesHeaderProps {
	totalCount: number;
	onCreatePage: () => void;
	isCreating: boolean;
	searchValue?: string;
	onSearchChange?: (value: string) => void;
}

export function PagesHeader({
	totalCount,
	onCreatePage,
	isCreating,
	searchValue = "",
	onSearchChange,
}: PagesHeaderProps) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-2">
				<IconFile className="h-5 w-5" />
				<span className="text-sm text-muted-foreground">
					{totalCount} pages total
				</span>
			</div>
			<div
				className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
				suppressHydrationWarning
			>
				{onSearchChange && (
					<Input
						placeholder="Search pages..."
						value={searchValue}
						onChange={(e) => onSearchChange(e.target.value)}
						className="w-full sm:w-64"
						data-testid="field-page-search"
						suppressHydrationWarning
					/>
				)}
				<PermissionGuard permission={CMS_PERMISSIONS.PAGES_CREATE}>
					<Button
						onClick={onCreatePage}
						disabled={isCreating}
						data-testid="btn-create-page"
						className="w-full sm:w-auto"
					>
						<IconPlus className="mr-2 h-4 w-4" />
						{isCreating ? "Creating..." : PAGE_BUTTON_LABELS.CREATE}
					</Button>
				</PermissionGuard>
			</div>
		</div>
	);
}
