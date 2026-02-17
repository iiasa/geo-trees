import {
	IconArrowsSort,
	IconPencil,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import type { MenuItemDto } from "@/infrastructure/api/types.gen";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/utils";
import {
	MENU_ITEM_BUTTONS,
	MENU_ITEM_EMPTY_STATES,
	MENU_ITEM_MESSAGES,
	MENU_ITEM_PERMISSION_LABELS,
	MENU_ITEM_STATUS_LABELS,
	MENU_ITEM_TABLE_HEADERS,
} from "../constants";
import type { FlattenedMenuItem } from "../utils";

interface MenuItemsTableProps {
	items: FlattenedMenuItem[];
	onAddChild: (item: MenuItemDto) => void;
	onEdit: (item: MenuItemDto) => void;
	onMove: (item: MenuItemDto) => void;
	onDelete: (item: MenuItemDto) => void;
	pageTitles: Record<string, string>;
	permissionLabels: Record<string, string>;
	isLoading?: boolean;
}

const renderDestination = (
	item: MenuItemDto,
	pageTitles: Record<string, string>,
) => {
	if (item.pageId) {
		const title = pageTitles[item.pageId] ?? item.pageId;
		return <span className="text-sm font-medium text-foreground">{title}</span>;
	}
	if (item.url) {
		return (
			<span className="text-sm font-mono text-muted-foreground break-all">
				{item.url}
			</span>
		);
	}
	return <span className="text-muted-foreground text-sm">-</span>;
};

const renderPermission = (
	item: MenuItemDto,
	permissionLabels: Record<string, string>,
) => {
	if (item.requiredPermissionName) {
		const label =
			permissionLabels[item.requiredPermissionName] ??
			item.requiredPermissionName;
		return <Badge variant="outline">{label}</Badge>;
	}
	return (
		<span className="text-muted-foreground text-sm">
			{MENU_ITEM_PERMISSION_LABELS.PUBLIC}
		</span>
	);
};

export function MenuItemsTable({
	items,
	onAddChild,
	onEdit,
	onMove,
	onDelete,
	pageTitles,
	permissionLabels,
	isLoading = false,
}: MenuItemsTableProps) {
	return (
		<div className="border rounded-lg">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{MENU_ITEM_TABLE_HEADERS.NAME}</TableHead>
						<TableHead>{MENU_ITEM_TABLE_HEADERS.DESTINATION}</TableHead>
						<TableHead>{MENU_ITEM_TABLE_HEADERS.PERMISSION}</TableHead>
						<TableHead className="w-24">
							{MENU_ITEM_TABLE_HEADERS.STATUS}
						</TableHead>
						<TableHead className="w-[200px] text-right">
							{MENU_ITEM_TABLE_HEADERS.ACTIONS}
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading ? (
						<TableRow>
							<TableCell colSpan={5} className="text-center py-6">
								{MENU_ITEM_MESSAGES.LOADING}
							</TableCell>
						</TableRow>
					) : items.length === 0 ? (
						<TableRow>
							<TableCell colSpan={5} className="text-center py-6">
								{MENU_ITEM_EMPTY_STATES.NO_ITEMS}
							</TableCell>
						</TableRow>
					) : (
						items.map((item) => (
							<TableRow key={item.id ?? `${item.displayName}-${item.depth}`}>
								<TableCell>
									<div
										className="flex items-center gap-2"
										style={{ paddingLeft: `${item.depth * 16}px` }}
									>
										<div className="h-2 w-2 rounded-full bg-muted-foreground/70" />
										<div className="flex flex-col">
											<span className="font-medium">
												{item.displayName ?? "-"}
											</span>
											{item.icon ? (
												<span className="text-xs text-muted-foreground font-mono">
													{item.icon}
												</span>
											) : null}
										</div>
									</div>
								</TableCell>
								<TableCell>{renderDestination(item, pageTitles)}</TableCell>
								<TableCell>
									{renderPermission(item, permissionLabels)}
								</TableCell>
								<TableCell>
									<Badge
										variant={item.isActive ? "secondary" : "outline"}
										className={cn(!item.isActive && "text-muted-foreground")}
									>
										{item.isActive
											? MENU_ITEM_STATUS_LABELS.ACTIVE
											: MENU_ITEM_STATUS_LABELS.INACTIVE}
									</Badge>
								</TableCell>
								<TableCell>
									<div className="flex justify-end gap-2">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => onAddChild(item)}
											title={MENU_ITEM_BUTTONS.ADD_CHILD}
										>
											<IconPlus className="size-4" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => onMove(item)}
											title={MENU_ITEM_BUTTONS.MOVE}
										>
											<IconArrowsSort className="size-4" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => onEdit(item)}
											title={MENU_ITEM_BUTTONS.EDIT}
										>
											<IconPencil className="size-4" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => onDelete(item)}
											title={MENU_ITEM_BUTTONS.DELETE}
											className="text-destructive"
										>
											<IconTrash className="size-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
