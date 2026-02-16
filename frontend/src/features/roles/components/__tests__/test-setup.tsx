import { vi } from "vitest";

// Mock ResizeObserver
class ResizeObserverMock {
	observe() {}
	unobserve() {}
	disconnect() {}
}
global.ResizeObserver = ResizeObserverMock as typeof ResizeObserver;

// Mock global API and store hooks
vi.mock("@/infrastructure/api/@tanstack/react-query.gen", () => ({
	getApiIdentityRolesOptions: () => ({
		queryKey: ["roles"],
		queryFn: () =>
			Promise.resolve({
				items: [
					{
						id: "1",
						name: "Admin",
						isDefault: true,
						isPublic: false,
						isStatic: false,
					},
					{
						id: "2",
						name: "User",
						isDefault: false,
						isPublic: true,
						isStatic: false,
					},
				],
				totalCount: 2,
			}),
	}),
}));

vi.mock("../stores/role-form-store", () => ({
	useRoleFormStore: () => ({
		role: null,
		open: false,
		setLoading: vi.fn(),
		openCreateForm: vi.fn(),
		openEditForm: vi.fn(),
		closeForm: vi.fn(),
	}),
}));

vi.mock("../stores/permission-store", () => ({
	usePermissionModalStore: () => ({
		openModal: vi.fn(),
	}),
}));

vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));
