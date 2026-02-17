// React Query Key Constants (for non-generated endpoints only)
export const TENANT_QUERY_KEYS = {
	// Tenant Management
	TENANTS: ["tenants"] as const,
	TENANT_CONNECTION_STRING: ["tenant", "connection-string"] as const,
} as const;

// Page Constants
export const TENANT_PAGE_CONSTANTS = {
	TITLE: "Tenants",
	DESCRIPTION: "Manage multi-tenant organizations",
} as const;
