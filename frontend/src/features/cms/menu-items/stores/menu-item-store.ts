import { create } from "zustand";

type MenuItemFormMode = "create" | "edit";

interface MenuItemFormState {
	open: boolean;
	mode: MenuItemFormMode;
	menuItemId: string | null;
	parentId: string | null;
	defaultOrder: number;
}

interface MenuItemFormActions {
	startCreate: (parentId?: string | null, defaultOrder?: number) => void;
	startEdit: (menuItemId: string) => void;
	closeForm: () => void;
}

export const useMenuItemFormStore = create<
	MenuItemFormState & MenuItemFormActions
>((set) => ({
	open: false,
	mode: "create",
	menuItemId: null,
	parentId: null,
	defaultOrder: 0,
	startCreate: (parentId = null, defaultOrder = 0) =>
		set({
			open: true,
			mode: "create",
			menuItemId: null,
			parentId,
			defaultOrder,
		}),
	startEdit: (menuItemId: string) =>
		set({
			open: true,
			mode: "edit",
			menuItemId,
			parentId: null,
			defaultOrder: 0,
		}),
	closeForm: () =>
		set({
			open: false,
			menuItemId: null,
			parentId: null,
			defaultOrder: 0,
		}),
}));

interface MenuItemMoveState {
	open: boolean;
	menuItemId: string | null;
	currentParentId: string | null;
}

interface MenuItemMoveActions {
	openMove: (menuItemId: string, currentParentId: string | null) => void;
	closeMove: () => void;
}

export const useMenuItemMoveStore = create<
	MenuItemMoveState & MenuItemMoveActions
>((set) => ({
	open: false,
	menuItemId: null,
	currentParentId: null,
	openMove: (menuItemId, currentParentId) =>
		set({ open: true, menuItemId, currentParentId }),
	closeMove: () =>
		set({
			open: false,
			menuItemId: null,
			currentParentId: null,
		}),
}));
