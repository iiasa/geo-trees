export const DASHBOARD_CONSTANTS = {
	TITLE: "Dashboard",
	DESCRIPTION: "Overview of your system statistics",
	METRICS: {
		USERS: {
			TITLE: "Total Users",
			DESCRIPTION: "All registered users",
		},
		ROLES: {
			TITLE: "Total Roles",
			DESCRIPTION: "All system roles",
		},
		TENANTS: {
			TITLE: "Total Tenants",
			DESCRIPTION: "All system tenants",
		},
	},
	CHARTS: {
		USERS_DISTRIBUTION: {
			TITLE: "Users Distribution",
			DESCRIPTION: "Overview of users by status",
		},
		ROLES_DISTRIBUTION: {
			TITLE: "Roles Distribution",
			DESCRIPTION: "Overview of roles in the system",
		},
	},
	ACTIVITY: {
		TITLE: "Recent Activity",
		DESCRIPTION: "Latest system updates",
	},
	EMPTY_STATE: {
		NO_DATA: "No data available",
		LOADING: "Loading...",
	},
} as const;
