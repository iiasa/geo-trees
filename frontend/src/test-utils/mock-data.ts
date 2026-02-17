import type {
	IdentityUserDto,
	IdentityRoleDto,
	TenantDto,
} from "@/infrastructure/api/types.gen";

// Mock Users
export const mockUsers: IdentityUserDto[] = [
	{
		id: "user-1",
		userName: "admin",
		name: "Admin",
		surname: "User",
		email: "admin@example.com",
		creationTime: "2024-01-01T00:00:00Z",
		isDeleted: false,
		tenantId: null,
	},
	{
		id: "user-2",
		userName: "john.doe",
		name: "John",
		surname: "Doe",
		email: "john.doe@example.com",
		creationTime: "2024-01-02T00:00:00Z",
		isDeleted: false,
		tenantId: "tenant-1",
	},
	{
		id: "user-3",
		userName: "jane.smith",
		name: "Jane",
		surname: "Smith",
		email: "jane.smith@example.com",
		creationTime: "2024-01-03T00:00:00Z",
		isDeleted: false,
		tenantId: "tenant-1",
	},
];

// Mock Roles
export const mockRoles: IdentityRoleDto[] = [
	{
		id: "role-1",
		name: "admin",
		isDefault: false,
		isStatic: true,
		isPublic: false,
		creationTime: "2024-01-01T00:00:00Z",
	},
	{
		id: "role-2",
		name: "user",
		isDefault: true,
		isStatic: true,
		isPublic: true,
		creationTime: "2024-01-01T00:00:00Z",
	},
	{
		id: "role-3",
		name: "moderator",
		isDefault: false,
		isStatic: false,
		isPublic: true,
		creationTime: "2024-01-02T00:00:00Z",
	},
];

// Mock Tenants
export const mockTenants: TenantDto[] = [
	{
		id: "tenant-1",
		name: "Default Tenant",
	},
	{
		id: "tenant-2",
		name: "Test Tenant",
	},
	{
		id: "tenant-3",
		name: "Development Tenant",
	},
];

// Mock Dashboard Tasks (subset of the full data)
export const mockDashboardTasks = [
	{
		id: 1,
		header: "Cover page",
		type: "Cover page",
		status: "In Process",
		target: "18",
		limit: "5",
		reviewer: "Eddie Lake",
	},
	{
		id: 2,
		header: "Table of contents",
		type: "Table of contents",
		status: "Done",
		target: "29",
		limit: "24",
		reviewer: "Eddie Lake",
	},
	{
		id: 3,
		header: "Executive summary",
		type: "Narrative",
		status: "Done",
		target: "10",
		limit: "13",
		reviewer: "Eddie Lake",
	},
	{
		id: 4,
		header: "Technical approach",
		type: "Narrative",
		status: "Done",
		target: "27",
		limit: "23",
		reviewer: "Jamik Tashpulatov",
	},
	{
		id: 5,
		header: "Design",
		type: "Narrative",
		status: "In Process",
		target: "2",
		limit: "16",
		reviewer: "Jamik Tashpulatov",
	},
];

// Mock Auth User (for auth context)
export const mockAuthUser = {
	sub: "user-1",
	name: "Admin User",
	email: "admin@example.com",
	email_verified: true,
	preferred_username: "admin",
	given_name: "Admin",
	family_name: "User",
};

// Mock API responses
export const mockPagedUsersResponse = {
	items: mockUsers,
	totalCount: mockUsers.length,
};

export const mockPagedRolesResponse = {
	items: mockRoles,
	totalCount: mockRoles.length,
};

export const mockPagedTenantsResponse = {
	items: mockTenants,
	totalCount: mockTenants.length,
};
