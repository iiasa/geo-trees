// API Configuration Constants
export const API_CONSTANTS = {
	// API endpoints
	HEALTH: "/api/health",
} as const;

// App Configuration Constants
export const APP_CONSTANTS = {
	// Base URL
	BASE_URL: import.meta.env.VITE_BASE_URL || "http://localhost:3000",
	// API Base URL
	API_BASE_URL:
		import.meta.env.VITE_API_BASE_URL || "http://localhost:44349",
} as const;
