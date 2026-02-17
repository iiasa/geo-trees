// OpenID Connect Configuration Constants
export const OIDC_CONSTANTS = {
	// OIDC Provider Configuration
	ISSUER: import.meta.env.VITE_OIDC_ISSUER || "https://your-oidc-provider.com",
	CLIENT_ID: import.meta.env.VITE_OIDC_CLIENT_ID || "your-client-id",
	CLIENT_SECRET:
		import.meta.env.VITE_OIDC_CLIENT_SECRET || "your-client-secret",
	// Application URLs
	BASE_URL: import.meta.env.VITE_BASE_URL || "http://localhost:3000",
	REDIRECT_URI:
		import.meta.env.VITE_OIDC_REDIRECT_URI ||
		"http://localhost:3000/auth/callback",

	// Session Configuration
	SESSION_SECRET:
		import.meta.env.VITE_SESSION_SECRET ||
		"your-super-secret-key-change-this-in-production",
	SESSION_COOKIE_NAME: "geo-trees-session",

	// Scopes (comma-separated string from env, or default)
	SCOPES: import.meta.env.VITE_OIDC_SCOPES
		? import.meta.env.VITE_OIDC_SCOPES.split(",").map((s: string) => s.trim())
		: ["openid", "profile", "email", "offline_access", "AbpTemplate"],

	// Additional OIDC parameters
	RESPONSE_TYPE: "code",
	GRANT_TYPE: "authorization_code",
} as const;

// Token refresh threshold (15 minutes in milliseconds)
export const TOKEN_REFRESH_THRESHOLD = 15 * 60 * 1000;

export const DEMO_CONSTANTS = {
	CLIENT: {
		TITLE: "Generated API Client Demo",
		DESCRIPTION:
			"Generated API client from OpenAPI specification with full TypeScript support.",
		USER_FORM: {
			USER_NAME_LABEL: "User Name",
			USER_NAME_PLACEHOLDER: "Enter user name",
			USER_NAME_DEFAULT: "Demo User",
			EMAIL_LABEL: "Email",
			EMAIL_PLACEHOLDER: "Enter email",
			EMAIL_DEFAULT: "demo@example.com",
			CREATE_BUTTON: "Create User",
			CREATING_BUTTON: "Creating...",
		},
		USERS: {
			TITLE: "Users",
			DESCRIPTION: (count: number) => `${count} users found`,
			TABLE: {
				ID: "ID",
				NAME: "Name",
				EMAIL: "Email",
			},
		},
		API_CLIENT_INFO: {
			TITLE: "API Client Info",
			GENERATED_FROM: "Generated from:",
			OPENAPI_URL: "https://abp.antosubash.com/swagger/v1/swagger.json",
			TYPESCRIPT_TYPES: "TypeScript types:",
			TYPESCRIPT_DESCRIPTION: "Generated with full type safety",
			TANSTACK_QUERY: "TanStack Query hooks:",
			TANSTACK_QUERY_DESCRIPTION: "Auto-generated for all API endpoints",
			ZOD_VALIDATION: "Zod validation:",
			ZOD_DESCRIPTION: "Runtime type validation for API responses",
		},
		APP_CONFIG: {
			TITLE: "Application Configuration",
			DESCRIPTION: "Application configuration from the backend",
			LOADING: "Loading application configuration...",
			ERROR: "Failed to load application configuration",
			SECTIONS: {
				CURRENT_USER: "Current User",
				AUTH: "Authentication",
				MULTI_TENANCY: "Multi-Tenancy",
				CURRENT_TENANT: "Current Tenant",
				FEATURES: "Features",
				GLOBAL_FEATURES: "Global Features",
				TIMING: "Timing",
				CLOCK: "Clock",
				SETTINGS: "Settings",
				LOCALIZATION: "Localization",
			},
		},
		ERROR: {
			TITLE: "Error",
			MESSAGE: "Failed to load users",
		},
		LOADING: {
			TITLE: "Loading",
			MESSAGE: "Loading users...",
		},
	},
} as const;
