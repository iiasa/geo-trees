const DEFAULT_APP_BASE_URL = "http://localhost:3000";
const DEFAULT_API_BASE_URL = "https://abp.antosubash.com";
const DEFAULT_PROXY_PATH = "/api/proxy";
const DEFAULT_OPENAPI_SPEC_URL =
	"https://abp.antosubash.com/swagger/v1/swagger.json";
const appBaseUrl = import.meta.env.VITE_BASE_URL || DEFAULT_APP_BASE_URL;
const proxyPath = import.meta.env.VITE_API_PROXY_PATH || DEFAULT_PROXY_PATH;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
const openApiSpecUrl =
	import.meta.env.VITE_OPENAPI_SPEC_URL || DEFAULT_OPENAPI_SPEC_URL;

// API Configuration Constants
export const API_CONSTANTS = {
	// Base URL for the actual API
	BASE_URL: apiBaseUrl,

	APP_BASE_URL: appBaseUrl,

	PROXY_PATH: proxyPath,

	// Absolute proxy URL for SSR/node environments
	PROXY_BASE_URL: proxyPath.startsWith("http")
		? proxyPath
		: `${appBaseUrl}${proxyPath}`,

	// Custom headers to add to all proxied requests
	CUSTOM_HEADERS: {
		"X-Proxy-Source": import.meta.env.VITE_APP_NAME || "abp-react-tanstack",
		"X-Requested-With": "XMLHttpRequest",
		"X-API-Version": import.meta.env.VITE_APP_VERSION || "v1",
		// Add any other custom headers you need
	},

	// OpenAPI Specification URL (used for API client generation)
	OPENAPI_SPEC_URL: openApiSpecUrl,
} as const;

// React Query Key Constants
export const QUERY_KEYS = {
	// Authentication
	AUTH_ME: ["auth", "me"] as const,
	// Profile
	PROFILE: ["profile", "my-profile"] as const,
} as const;
