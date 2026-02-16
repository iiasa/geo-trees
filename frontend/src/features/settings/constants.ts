// Settings Feature Constants

export const SETTINGS_ROUTES = {
	INDEX: "/settings",
} as const;

export const SETTINGS_LABELS = {
	EMAIL: {
		TITLE: "Email Settings",
		DESCRIPTION: "Configure SMTP settings for sending emails",
		SMTP_HOST: "SMTP Host",
		SMTP_PORT: "SMTP Port",
		SMTP_USERNAME: "Username",
		SMTP_PASSWORD: "Password",
		SMTP_DOMAIN: "Domain",
		ENABLE_SSL: "Enable SSL",
		USE_DEFAULT_CREDENTIALS: "Use Default Credentials",
		DEFAULT_FROM_ADDRESS: "Default From Address",
		DEFAULT_FROM_DISPLAY_NAME: "Default From Display Name",
		TEST_EMAIL: "Send Test Email",
		SAVE: "Save Settings",
	},
	TIMEZONE: {
		TITLE: "Timezone Settings",
		DESCRIPTION: "Configure default timezone for the application",
		TIMEZONE: "Default Timezone",
		SAVE: "Save Settings",
	},
	COMMENTS: {
		TITLE: "Comment Settings",
		DESCRIPTION: "Configure CMS Kit comment settings",
		REQUIRE_APPROVAL: "Require Comment Approval",
		SAVE: "Save Settings",
	},
	FEATURES: {
		TITLE: "Feature Management",
		DESCRIPTION: "Configure host-level feature flags",
		PROVIDER_NAME: "Provider Name",
		PROVIDER_KEY: "Provider Key",
		SAVE: "Save Changes",
		SAVING: "Saving...",
		RESET: "Reset",
	},
	TEST_EMAIL_DIALOG: {
		TITLE: "Send Test Email",
		DESCRIPTION: "Send a test email to verify SMTP configuration",
		SENDER_EMAIL: "Sender Email Address",
		TARGET_EMAIL: "Target Email Address",
		SUBJECT: "Subject",
		BODY: "Body",
		SEND: "Send Test Email",
		CANCEL: "Cancel",
	},
} as const;

export const SETTINGS_MESSAGES = {
	EMAIL: {
		SAVE_SUCCESS: "Email settings saved successfully",
		SAVE_ERROR: "Failed to save email settings",
		TEST_EMAIL_SUCCESS: "Test email sent successfully",
		TEST_EMAIL_ERROR: "Failed to send test email",
	},
	TIMEZONE: {
		SAVE_SUCCESS: "Timezone settings saved successfully",
		SAVE_ERROR: "Failed to save timezone settings",
	},
	COMMENTS: {
		SAVE_SUCCESS: "Comment settings saved successfully",
		SAVE_ERROR: "Failed to save comment settings",
	},
} as const;

export const SETTINGS_VALIDATION = {
	EMAIL: {
		SMTP_HOST_REQUIRED: "SMTP host is required",
		SMTP_PORT_REQUIRED: "SMTP port is required",
		SMTP_PORT_MIN: "Port must be at least 1",
		SMTP_PORT_MAX: "Port must be at most 65535",
		EMAIL_INVALID: "Invalid email address",
		DEFAULT_FROM_ADDRESS_REQUIRED: "Default from address is required",
	},
	TEST_EMAIL: {
		SENDER_EMAIL_REQUIRED: "Sender email is required",
		TARGET_EMAIL_REQUIRED: "Target email is required",
		SUBJECT_REQUIRED: "Subject is required",
		EMAIL_INVALID: "Invalid email address",
	},
	TIMEZONE: {
		TIMEZONE_REQUIRED: "Timezone is required",
	},
} as const;
