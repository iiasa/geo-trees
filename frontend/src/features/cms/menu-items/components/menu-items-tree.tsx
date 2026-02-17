import { Badge } from "@/shared/components/ui/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import {
	MENU_ITEM_EMPTY_STATES,
	MENU_ITEM_MESSAGES,
	MENU_ITEM_STATUS_LABELS,
} from "../constants";
import type { MenuItemNode } from "../utils";

interface MenuItemsTreeProps {
	title: string;
	nodes: MenuItemNode[];
	isLoading?: boolean;
	emptyMessage?: string;
}

const TreeBranch = ({
	nodes,
	depth = 0,
}: {
	nodes: MenuItemNode[];
	depth?: number;
}) => {
	if (!nodes.length) return null;

	return (
		<ul className="space-y-2">
			{nodes.map((node) => (
				<li key={node.id ?? `${node.displayName}-${depth}`}>
					<div
						className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2"
						style={{ marginLeft: depth * 8 }}
					>
						<div className="flex flex-col">
							<span className="font-medium">{node.displayName ?? "-"}</span>
							{node.url ? (
								<span className="text-xs text-muted-foreground break-all">
									{node.url}
								</span>
							) : null}
						</div>
						<Badge variant={node.isActive ? "secondary" : "outline"}>
							{node.isActive
								? MENU_ITEM_STATUS_LABELS.ACTIVE
								: MENU_ITEM_STATUS_LABELS.INACTIVE}
						</Badge>
					</div>
					{node.children.length ? (
						<TreeBranch nodes={node.children} depth={depth + 1} />
					) : null}
				</li>
			))}
		</ul>
	);
};

export function MenuItemsTree({
	title,
	nodes,
	isLoading = false,
	emptyMessage = MENU_ITEM_EMPTY_STATES.NO_ITEMS,
}: MenuItemsTreeProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="text-sm text-muted-foreground">
						{MENU_ITEM_MESSAGES.LOADING}
					</div>
				) : nodes.length === 0 ? (
					<div className="text-sm text-muted-foreground">{emptyMessage}</div>
				) : (
					<TreeBranch nodes={nodes} />
				)}
			</CardContent>
		</Card>
	);
}
