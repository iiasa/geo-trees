import { http, HttpResponse } from "msw";
import type {
	IdentityUserCreateDto,
	IdentityUserUpdateDto,
	IdentityRoleCreateDto,
	IdentityRoleUpdateDto,
	TenantCreateDto,
	TenantUpdateDto,
} from "@/infrastructure/api/types.gen";
import {
	mockAuthUser,
	mockPagedUsersResponse,
	mockPagedRolesResponse,
	mockPagedTenantsResponse,
} from "./mock-data";

// Base URL for API calls
const API_BASE = "http://localhost:44349";

// Auth endpoints
export const authHandlers = [
	// Login endpoint
	http.post("/auth/login", async () => {
		return HttpResponse.json({
			authUrl:
				"https://mock-oidc-provider.com/oauth/authorize?client_id=test&redirect_uri=http://localhost:3000/auth/callback",
		});
	}),

	// Logout endpoint
	http.post("/auth/logout", async () => {
		return HttpResponse.json({ success: true });
	}),

	// Auth callback endpoint
	http.get("/auth/callback", async () => {
		return HttpResponse.redirect("http://localhost:3000/dashboard");
	}),

	// Auth me endpoint
	http.get("/auth/me", async () => {
		return HttpResponse.json({
			user: mockAuthUser,
		});
	}),
];

// API endpoints
export const apiHandlers = [
	// Users endpoints
	http.get(`${API_BASE}/api/identity/users`, async () => {
		return HttpResponse.json(mockPagedUsersResponse);
	}),

	http.get(`${API_BASE}/api/identity/users/:id`, async ({ params }) => {
		const user = mockPagedUsersResponse.items?.find((u) => u.id === params.id);
		if (!user) {
			return HttpResponse.json({ error: "User not found" }, { status: 404 });
		}
		return HttpResponse.json(user);
	}),

	http.post(`${API_BASE}/api/identity/users`, async ({ request }) => {
		const body = (await request.json()) as IdentityUserCreateDto;
		const newUser = {
			...body,
			id: `user-${Date.now()}`,
			creationTime: new Date().toISOString(),
			isDeleted: false,
		};
		return HttpResponse.json(newUser, { status: 201 });
	}),

	http.put(
		`${API_BASE}/api/identity/users/:id`,
		async ({ params, request }) => {
			const body = (await request.json()) as IdentityUserUpdateDto;
			const updatedUser = {
				...body,
				id: params.id,
				lastModificationTime: new Date().toISOString(),
			};
			return HttpResponse.json(updatedUser);
		},
	),

	http.delete(`${API_BASE}/api/identity/users/:id`, async () => {
		return HttpResponse.json({ success: true });
	}),

	// Roles endpoints
	http.get(`${API_BASE}/api/identity/roles`, async () => {
		return HttpResponse.json(mockPagedRolesResponse);
	}),

	http.get(`${API_BASE}/api/identity/roles/:id`, async ({ params }) => {
		const role = mockPagedRolesResponse.items?.find((r) => r.id === params.id);
		if (!role) {
			return HttpResponse.json({ error: "Role not found" }, { status: 404 });
		}
		return HttpResponse.json(role);
	}),

	http.post(`${API_BASE}/api/identity/roles`, async ({ request }) => {
		const body = (await request.json()) as IdentityRoleCreateDto;
		const newRole = {
			...body,
			id: `role-${Date.now()}`,
			creationTime: new Date().toISOString(),
			isDefault: false,
			isStatic: false,
			isPublic: true,
		};
		return HttpResponse.json(newRole, { status: 201 });
	}),

	http.put(
		`${API_BASE}/api/identity/roles/:id`,
		async ({ params, request }) => {
			const body = (await request.json()) as IdentityRoleUpdateDto;
			const updatedRole = {
				...body,
				id: params.id,
			};
			return HttpResponse.json(updatedRole);
		},
	),

	http.delete(`${API_BASE}/api/identity/roles/:id`, async () => {
		return HttpResponse.json({ success: true });
	}),

	// Tenants endpoints
	http.get(`${API_BASE}/api/multi-tenancy/tenants`, async () => {
		return HttpResponse.json(mockPagedTenantsResponse);
	}),

	http.get(`${API_BASE}/api/multi-tenancy/tenants/:id`, async ({ params }) => {
		const tenant = mockPagedTenantsResponse.items?.find(
			(t) => t.id === params.id,
		);
		if (!tenant) {
			return HttpResponse.json({ error: "Tenant not found" }, { status: 404 });
		}
		return HttpResponse.json(tenant);
	}),

	http.post(`${API_BASE}/api/multi-tenancy/tenants`, async ({ request }) => {
		const body = (await request.json()) as TenantCreateDto;
		const newTenant = {
			...body,
			id: `tenant-${Date.now()}`,
		};
		return HttpResponse.json(newTenant, { status: 201 });
	}),

	http.put(
		`${API_BASE}/api/multi-tenancy/tenants/:id`,
		async ({ params, request }) => {
			const body = (await request.json()) as TenantUpdateDto;
			const updatedTenant = {
				...body,
				id: params.id,
			};
			return HttpResponse.json(updatedTenant);
		},
	),

	http.delete(`${API_BASE}/api/multi-tenancy/tenants/:id`, async () => {
		return HttpResponse.json({ success: true });
	}),
];

// Combined handlers for all endpoints
export const allHandlers = [...authHandlers, ...apiHandlers];
