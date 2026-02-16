// Profile Feature Constants

export const PROFILE_ROUTES = {
	INDEX: "/profile",
	GENERAL: "/profile",
	SECURITY: "/profile/security",
} as const;

export const PROFILE_LABELS = {
	GENERAL: {
		TITLE: "Profile Information",
		DESCRIPTION: "Manage your personal information and account details",
		USERNAME: "Username",
		EMAIL: "Email Address",
		NAME: "First Name",
		SURNAME: "Last Name",
		PHONE_NUMBER: "Phone Number",
		SAVE: "Save Changes",
		CANCEL: "Cancel",
		EDIT: "Edit Profile",
		VIEW_MODE: "View Mode",
		EDIT_MODE: "Edit Mode",
	},
	SECURITY: {
		TITLE: "Change Password",
		DESCRIPTION: "Update your password to keep your account secure",
		CURRENT_PASSWORD: "Current Password",
		NEW_PASSWORD: "New Password",
		CONFIRM_PASSWORD: "Confirm New Password",
		SAVE: "Change Password",
		CANCEL: "Cancel",
	},
	TABS: {
		GENERAL: "General",
		SECURITY: "Security",
	},
} as const;

export const PROFILE_MESSAGES = {
	GENERAL: {
		SAVE_SUCCESS: "Profile updated successfully",
		SAVE_ERROR: "Failed to update profile",
		LOAD_ERROR: "Failed to load profile data",
	},
	SECURITY: {
		SAVE_SUCCESS: "Password changed successfully",
		SAVE_ERROR: "Failed to change password",
		INCORRECT_CURRENT: "Current password is incorrect",
	},
} as const;

export const PROFILE_VALIDATION = {
	USERNAME: {
		REQUIRED: "Username is required",
		MIN_LENGTH: "Username must be at least 3 characters",
		MAX_LENGTH: "Username must be at most 256 characters",
	},
	EMAIL: {
		REQUIRED: "Email is required",
		INVALID: "Invalid email address",
	},
	NAME: {
		MAX_LENGTH: "First name must be at most 64 characters",
	},
	SURNAME: {
		MAX_LENGTH: "Last name must be at most 64 characters",
	},
	PHONE_NUMBER: {
		INVALID: "Invalid phone number format",
	},
	PASSWORD: {
		CURRENT_REQUIRED: "Current password is required",
		NEW_REQUIRED: "New password is required",
		MIN_LENGTH: "Password must be at least 6 characters",
		COMPLEXITY:
			"Password must contain uppercase, lowercase, and number characters",
		CONFIRM_REQUIRED: "Please confirm your new password",
		MISMATCH: "Passwords do not match",
	},
} as const;

export const PROFILE_FIELD_CONFIG = {
	USERNAME: {
		MIN_LENGTH: 3,
		MAX_LENGTH: 256,
	},
	NAME: {
		MAX_LENGTH: 64,
	},
	SURNAME: {
		MAX_LENGTH: 64,
	},
	PASSWORD: {
		MIN_LENGTH: 6,
		REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
	},
} as const;
