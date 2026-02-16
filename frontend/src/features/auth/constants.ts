// React Query Key Constants (for non-generated endpoints only)
export const AUTH_QUERY_KEYS = {
	// Authentication (custom endpoint)
	AUTH_ME: ["auth", "me"] as const,
} as const;

// Auth Routes
export const AUTH_ROUTES = {
	LOGIN: "/auth/login",
	LOGOUT: "/auth/logout",
	CALLBACK: "/auth/callback",
	FORGOT_PASSWORD: "/auth/forgot-password",
	RESET_PASSWORD: "/auth/reset-password",
	REGISTER: "/auth/register",
} as const;

// Forgot Password Labels
export const FORGOT_PASSWORD_LABELS = {
	TITLE: "Forgot Password",
	DESCRIPTION:
		"Enter your email address and we'll send you a password reset code",
	EMAIL: "Email Address",
	APP_NAME: "Application Name",
	SUBMIT: "Send Reset Code",
	BACK_TO_LOGIN: "Back to Login",
	SUCCESS_TITLE: "Check Your Email",
	SUCCESS_MESSAGE: "We've sent a password reset code to your email address",
} as const;

// Reset Password Labels
export const RESET_PASSWORD_LABELS = {
	TITLE: "Reset Password",
	DESCRIPTION: "Enter your new password",
	USER_ID: "User ID",
	RESET_TOKEN: "Reset Token",
	NEW_PASSWORD: "New Password",
	CONFIRM_PASSWORD: "Confirm Password",
	SUBMIT: "Reset Password",
	SUCCESS_TITLE: "Password Reset Successful",
	SUCCESS_MESSAGE:
		"Your password has been reset successfully. You can now login with your new password.",
} as const;

// Password Reset Messages
export const PASSWORD_RESET_MESSAGES = {
	SEND_CODE_SUCCESS: "Password reset code sent to your email",
	SEND_CODE_ERROR: "Failed to send password reset code",
	RESET_SUCCESS: "Password reset successfully",
	RESET_ERROR: "Failed to reset password",
	INVALID_TOKEN: "Invalid or expired reset token",
	TOKEN_VERIFY_ERROR: "Failed to verify reset token",
} as const;

// Password Reset Validation
export const PASSWORD_RESET_VALIDATION = {
	EMAIL: {
		REQUIRED: "Email is required",
		INVALID: "Invalid email address",
	},
	APP_NAME: {
		REQUIRED: "Application name is required",
	},
	USER_ID: {
		REQUIRED: "User ID is required",
	},
	RESET_TOKEN: {
		REQUIRED: "Reset token is required",
	},
	PASSWORD: {
		REQUIRED: "Password is required",
		MIN_LENGTH: "Password must be at least 6 characters",
		COMPLEXITY:
			"Password must contain uppercase, lowercase, and number characters",
		CONFIRM_REQUIRED: "Please confirm your password",
		MISMATCH: "Passwords do not match",
	},
} as const;

// Registration Labels
export const REGISTER_LABELS = {
	TITLE: "Create Account",
	DESCRIPTION: "Sign up for a Geo Trees account",
	USERNAME: "Username",
	EMAIL: "Email Address",
	PASSWORD: "Password",
	CONFIRM_PASSWORD: "Confirm Password",
	INSTITUTION: "Institution",
	COUNTRY: "Country",
	TERMS: "I accept the",
	TERMS_LINK: "Terms and Conditions",
	SUBMIT: "Create Account",
	BACK_TO_LOGIN: "Back to Login",
	SUCCESS_TITLE: "Account Created",
	SUCCESS_MESSAGE:
		"Your account has been created successfully. You can now sign in.",
	ALREADY_HAVE_ACCOUNT: "Already have an account?",
	SIGN_IN: "Sign In",
} as const;

// Registration Messages
export const REGISTER_MESSAGES = {
	SUCCESS: "Account created successfully",
	ERROR: "Failed to create account",
} as const;

// Registration Validation
export const REGISTER_VALIDATION = {
	USERNAME: {
		REQUIRED: "Username is required",
	},
	EMAIL: {
		REQUIRED: "Email is required",
		INVALID: "Invalid email address",
	},
	PASSWORD: {
		REQUIRED: "Password is required",
		MIN_LENGTH: "Password must be at least 6 characters",
		COMPLEXITY:
			"Password must contain uppercase, lowercase, and number characters",
		CONFIRM_REQUIRED: "Please confirm your password",
		MISMATCH: "Passwords do not match",
	},
	INSTITUTION: {
		REQUIRED: "Institution is required",
	},
	COUNTRY: {
		REQUIRED: "Country is required",
	},
	TERMS: {
		REQUIRED: "You must accept the Terms and Conditions",
	},
} as const;
