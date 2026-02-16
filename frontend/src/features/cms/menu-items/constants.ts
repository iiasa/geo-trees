export const MENU_ITEMS_PAGE_COPY = {
	TITLE: "Navigation",
	DESCRIPTION: "Manage CMS menu items, links, and hierarchy",
	SECTION_TREE: "Menu structure",
	SECTION_TABLE: "Menu items",
	SECTION_PUBLIC: "Public navigation preview",
} as const;

export const MENU_ITEM_BUTTONS = {
	ADD_ROOT: "Add menu item",
	ADD_CHILD: "Add child",
	EDIT: "Edit",
	MOVE: "Move",
	DELETE: "Delete",
	REFRESH: "Refresh",
	CLOSE: "Close",
	SAVE: "Save",
	APPLY: "Apply",
} as const;

export const MENU_ITEM_TABLE_HEADERS = {
	NAME: "Menu item",
	DESTINATION: "Destination",
	PERMISSION: "Permission",
	STATUS: "Status",
	ACTIONS: "Actions",
} as const;

export const MENU_ITEM_FORM_LABELS = {
	DISPLAY_NAME: "Display name",
	URL: "URL",
	ICON: "Icon",
	TARGET: "Target",
	ELEMENT_ID: "Element id",
	CSS_CLASS: "CSS class",
	PAGE: "Page",
	PERMISSION: "Required permission",
	IS_ACTIVE: "Active",
	PARENT: "Parent",
	ORDER: "Order",
} as const;

export const MENU_ITEM_FORM_PLACEHOLDERS = {
	DISPLAY_NAME: "Navigation label",
	URL: "https://example.com or /path",
	ICON: "tabler icon name (e.g. IconHome)",
	TARGET: "_self or _blank",
	ELEMENT_ID: "DOM id (optional)",
	CSS_CLASS: "Custom CSS class",
	PAGE: "Choose a CMS page",
	PERMISSION: "Pick a permission",
	PARENT: "Root (no parent)",
	ORDER: "0 places item at the top",
} as const;

export const MENU_ITEM_FORM_HELPERS = {
	URL: "Provide URL or leave empty when using a CMS page link.",
	PAGE: "Select a CMS page to automatically populate the URL.",
	PERMISSION: "Permission required to see this link.",
	PARENT: "Use Move to change parent after creation.",
	ORDER: "Lower numbers render first within the same parent.",
} as const;

export const MENU_ITEM_MESSAGES = {
	LOAD_ERROR: "Failed to load menu items",
	CREATE_SUCCESS: "Menu item created successfully",
	UPDATE_SUCCESS: "Menu item updated successfully",
	DELETE_SUCCESS: "Menu item deleted",
	MOVE_SUCCESS: "Menu item moved",
	ACTION_ERROR: "Something went wrong. Please try again.",
	DELETE_CONFIRMATION: "Are you sure you want to delete this menu item?",
	LOADING: "Loading menu items...",
} as const;

export const MENU_ITEM_MOVE_COPY = {
	TITLE: "Move menu item",
	DESCRIPTION: "Change the parent and position of this item.",
	PARENT_LABEL: "New parent",
	POSITION_LABEL: "Position",
	POSITION_HELP: "0 = top within the selected parent.",
} as const;

export const MENU_ITEM_EMPTY_STATES = {
	NO_ITEMS: "No menu items found. Create the first item to get started.",
	NO_PUBLIC_ITEMS: "No public menu items available yet.",
} as const;

export const MENU_ITEM_TREE_LABELS = {
	ROOT: "Root",
} as const;

export const MENU_ITEM_STATUS_LABELS = {
	ACTIVE: "Active",
	INACTIVE: "Inactive",
} as const;

export const MENU_ITEM_SEARCH = {
	PLACEHOLDER: "Search menu items",
} as const;

export const MENU_ITEM_VALIDATION = {
	DISPLAY_REQUIRED: "Display name is required",
} as const;

export const MENU_ITEM_PERMISSION_LABELS = {
	PUBLIC: "Public",
} as const;
