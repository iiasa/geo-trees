import type { MenuItemDto } from "@/infrastructure/api/types.gen";
import { MENU_ITEM_TREE_LABELS } from "./constants";

export type MenuItemNode = MenuItemDto & {
	children: MenuItemNode[];
};

export type FlattenedMenuItem = MenuItemDto & {
	depth: number;
};

const sortByOrder = (a: MenuItemDto, b: MenuItemDto) => {
	const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
	const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
	if (orderA !== orderB) return orderA - orderB;

	const nameA = a.displayName ?? "";
	const nameB = b.displayName ?? "";
	return nameA.localeCompare(nameB);
};

export const buildMenuTree = (items: MenuItemDto[]): MenuItemNode[] => {
	const byId = new Map<string, MenuItemNode>();
	const roots: MenuItemNode[] = [];

	items.forEach((item) => {
		if (!item.id) return;
		byId.set(item.id, { ...item, children: [] });
	});

	items.forEach((item) => {
		if (!item.id) return;
		const node = byId.get(item.id);
		if (!node) return;

		const parentId = item.parentId ?? null;
		if (parentId && byId.has(parentId)) {
			byId.get(parentId)?.children.push(node);
		} else {
			roots.push(node);
		}
	});

	const sortChildren = (nodes: MenuItemNode[]) => {
		nodes.sort(sortByOrder);
		nodes.forEach((child) => {
			sortChildren(child.children);
		});
	};
	sortChildren(roots);

	return roots;
};

export const flattenMenuTree = (
	nodes: MenuItemNode[],
	depth = 0,
): FlattenedMenuItem[] => {
	return nodes.flatMap((node) => {
		const current: FlattenedMenuItem = { ...node, depth };
		const children = flattenMenuTree(node.children, depth + 1);
		return [current, ...children];
	});
};

export const collectDescendantIds = (
	node: MenuItemNode,
	acc: Set<string>,
): void => {
	if (node.id) {
		acc.add(node.id);
	}
	node.children.forEach((child) => {
		collectDescendantIds(child, acc);
	});
};

export const buildParentOptions = (
	tree: MenuItemNode[],
	excludeId?: string | null,
) => {
	const excluded = new Set<string>();
	if (excludeId) {
		const markDescendants = (nodes: MenuItemNode[]) => {
			nodes.forEach((node) => {
				if (node.id === excludeId) {
					collectDescendantIds(node, excluded);
				} else {
					markDescendants(node.children);
				}
			});
		};
		markDescendants(tree);
	}

	const options: { id: string | null; label: string; depth: number }[] = [
		{ id: null, label: MENU_ITEM_TREE_LABELS.ROOT, depth: 0 },
	];

	const traverse = (nodes: MenuItemNode[], depth: number) => {
		nodes.forEach((node) => {
			if (node.id && !excluded.has(node.id)) {
				options.push({
					id: node.id,
					label: node.displayName ?? "Untitled",
					depth,
				});
				traverse(node.children, depth + 1);
			}
		});
	};

	traverse(tree, 1);
	return options;
};

export const getSiblingCount = (
	items: MenuItemDto[],
	parentId: string | null,
	excludeId?: string | null,
) =>
	items.filter((item) => {
		const sameParent = (item.parentId ?? null) === parentId;
		const isExcluded = excludeId && item.id === excludeId;
		return sameParent && !isExcluded;
	}).length;

export const findMenuItem = (
	tree: MenuItemNode[],
	id?: string | null,
): MenuItemNode | null => {
	if (!id) return null;
	for (const node of tree) {
		if (node.id === id) return node;
		const found = findMenuItem(node.children, id);
		if (found) return found;
	}
	return null;
};
