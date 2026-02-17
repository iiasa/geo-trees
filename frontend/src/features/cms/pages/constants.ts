// Query Keys for TanStack Query
export const PAGE_QUERY_KEYS = {
	PAGES: ["cms", "pages"] as const,
	PAGE_DETAIL: (id: string) => ["cms", "pages", id] as const,
	SLUG_EXISTS: (slug: string) => ["cms", "pages", "slug-exists", slug] as const,
} as const;

export const PAGE_PUBLIC_BASE_PATH = "/page";

// Form Field Labels
export const PAGE_FORM_LABELS = {
	TITLE: "Title",
	SLUG: "URL Slug",
	CONTENT: "Content",
	TITLE_PLACEHOLDER: "Enter page title",
	SLUG_PLACEHOLDER: "enter-page-slug",
	CONTENT_PLACEHOLDER: "Enter page content",
} as const;

// Validation Messages
export const PAGE_VALIDATION_MESSAGES = {
	TITLE_REQUIRED: "Title is required",
	TITLE_MIN_LENGTH: "Title must be at least 3 characters",
	SLUG_REQUIRED: "Slug is required",
	SLUG_INVALID:
		"Slug must contain only lowercase letters, numbers, and hyphens",
	SLUG_EXISTS: "This slug is already in use",
	CONTENT_REQUIRED: "Content is required",
} as const;

// Action Messages
export const PAGE_ACTION_MESSAGES = {
	CREATE_SUCCESS: "Page created successfully",
	UPDATE_SUCCESS: "Page updated successfully",
	DELETE_SUCCESS: "Page deleted successfully",
	SET_HOMEPAGE_SUCCESS: "Homepage set successfully",
	CREATE_ERROR: "Failed to create page",
	UPDATE_ERROR: "Failed to update page",
	DELETE_ERROR: "Failed to delete page",
	SET_HOMEPAGE_ERROR: "Failed to set homepage",
} as const;

// Dialog Titles
export const PAGE_DIALOG_TITLES = {
	CREATE: "Create Page",
	EDIT: "Edit Page",
	DELETE: "Delete Page",
	DELETE_CONFIRMATION: "Are you sure you want to delete this page?",
} as const;

// Button Labels
export const PAGE_BUTTON_LABELS = {
	CREATE: "Create Page",
	SAVE: "Save",
	CANCEL: "Cancel",
	DELETE: "Delete",
	EDIT: "Edit",
	SET_HOMEPAGE: "Set as Homepage",
	VIEW: "View",
} as const;

// Page Constants
export const PAGE_PAGE_CONSTANTS = {
	TITLE: "Pages",
	DESCRIPTION: "Manage CMS pages and content",
} as const;

// Create/Edit Page Constants
export const PAGE_CREATE_CONSTANTS = {
	TITLE: "Create Page",
	DESCRIPTION: "Create a new page with a title, slug, and content",
} as const;

export const PAGE_EDIT_CONSTANTS = {
	TITLE: "Edit Page",
	DESCRIPTION: "Edit the page details",
} as const;

// Puck Editor Constants
export const PUCK_EDITOR_CONSTANTS = {
	CONTENT_PLACEHOLDER: "Use the editor to add content blocks",
	NO_CONTENT: "No content available",
	INVALID_CONTENT: "Invalid content format",
} as const;

// Puck Component Labels
export const PUCK_COMPONENT_LABELS = {
	// Existing components
	HEADING: "Heading",
	TEXT: "Text",
	BUTTON: "Button",
	IMAGE: "Image",

	// New components
	CARD: "Card",
	LIST: "List",
	QUOTE: "Quote",
	VIDEO: "Video",
	DIVIDER: "Divider",
	CONTAINER: "Container",
	GRID: "Grid",
	FORM: "Form",
	ACCORDION: "Accordion",
	ALERT: "Alert",
	TABS: "Tabs",
	CTA: "Call to Action",
	STATS: "Statistics",
} as const;

// Puck Component Field Labels
export const PUCK_FIELD_LABELS = {
	// Common fields
	TITLE: "Title",
	DESCRIPTION: "Description",
	TEXT: "Text",
	CONTENT: "Content",
	URL: "URL",
	VARIANT: "Variant",
	ALIGNMENT: "Alignment",

	// Card fields
	IMAGE_URL: "Image URL",
	LINK_URL: "Link URL",

	// List fields
	LIST_TYPE: "List Type",
	ITEMS: "Items",
	ORDERED: "Ordered",
	UNORDERED: "Unordered",

	// Quote fields
	AUTHOR: "Author",
	SOURCE: "Source",

	// Video fields
	VIDEO_URL: "Video URL",
	AUTOPLAY: "Autoplay",
	CONTROLS: "Show Controls",

	// Divider fields
	THICKNESS: "Thickness",
	COLOR: "Color",
	SOLID: "Solid",
	DASHED: "Dashed",
	DOTTED: "Dotted",

	// Container fields
	BACKGROUND_COLOR: "Background Color",
	PADDING: "Padding",
	MARGIN: "Margin",
	BORDER_RADIUS: "Border Radius",

	// Grid fields
	COLUMNS: "Columns",
	GAP: "Gap",

	// Form fields
	FIELDS: "Fields",
	SUBMIT_BUTTON_TEXT: "Submit Button Text",
	FIELD_TYPE: "Field Type",
	FIELD_NAME: "Field Name",
	FIELD_LABEL: "Field Label",
	FIELD_REQUIRED: "Required",
	TEXT_INPUT: "Text Input",
	EMAIL_INPUT: "Email Input",
	TEXTAREA: "Textarea",
} as const;
