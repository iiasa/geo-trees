// Query Keys for TanStack Query
export const COMMENT_QUERY_KEYS = {
	COMMENTS: ["cms", "comments"] as const,
	COMMENT_DETAIL: (id: string) => ["cms", "comments", id] as const,
	WAITING_COUNT: ["cms", "comments", "waiting-count"] as const,
	ENTITY_COMMENTS: (entityType: string, entityId: string) =>
		["cms", "comments", entityType, entityId] as const,
} as const;

// Entity Types
export const ENTITY_TYPES = {
	PAGE: "Page",
	BLOG_POST: "BlogPost",
} as const;

// Comment Approval Status
export const COMMENT_APPROVAL_STATUS = {
	APPROVED: "Approved",
	PENDING: "Pending",
	REJECTED: "Rejected",
} as const;

// Form Field Labels
export const COMMENT_FORM_LABELS = {
	TEXT: "Comment",
	TEXT_PLACEHOLDER: "Write your comment...",
	REPLY_PLACEHOLDER: "Write your reply...",
} as const;

// Validation Messages
export const COMMENT_VALIDATION_MESSAGES = {
	TEXT_REQUIRED: "Comment text is required",
	TEXT_MIN_LENGTH: "Comment must be at least 3 characters",
} as const;

// Action Messages
export const COMMENT_ACTION_MESSAGES = {
	CREATE_SUCCESS: "Comment posted successfully",
	UPDATE_SUCCESS: "Comment updated successfully",
	DELETE_SUCCESS: "Comment deleted successfully",
	APPROVE_SUCCESS: "Comment approved successfully",
	REJECT_SUCCESS: "Comment rejected successfully",
	CREATE_ERROR: "Failed to post comment",
	UPDATE_ERROR: "Failed to update comment",
	DELETE_ERROR: "Failed to delete comment",
	APPROVE_ERROR: "Failed to approve comment",
	REJECT_ERROR: "Failed to reject comment",
} as const;

// Dialog Titles
export const COMMENT_DIALOG_TITLES = {
	CREATE: "Add Comment",
	EDIT: "Edit Comment",
	REPLY: "Reply to Comment",
	DELETE: "Delete Comment",
	DELETE_CONFIRMATION: "Are you sure you want to delete this comment?",
} as const;

// Button Labels
export const COMMENT_BUTTON_LABELS = {
	CREATE: "Post Comment",
	SAVE: "Save",
	CANCEL: "Cancel",
	DELETE: "Delete",
	EDIT: "Edit",
	REPLY: "Reply",
	APPROVE: "Approve",
	REJECT: "Reject",
	LOAD_MORE: "Load More",
} as const;

// Filter Options
export const COMMENT_FILTER_OPTIONS = {
	ALL: "All",
	APPROVED: "Approved",
	PENDING: "Pending",
	REJECTED: "Rejected",
} as const;

// Page Constants
export const COMMENT_PAGE_CONSTANTS = {
	TITLE: "Comments",
	DESCRIPTION: "Moderate and manage user comments",
} as const;
