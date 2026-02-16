import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RolesList } from "../roles-list";

// Mocking dependencies
vi.mock("@/infrastructure/api/@tanstack/react-query.gen", () => {
	const originalModule = vi.importActual(
		"@/infrastructure/api/@tanstack/react-query.gen",
	);

	const mockRoleGetListOptions = vi.fn(() => ({
		queryKey: ["roles"],
		queryFn: async () => ({
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
	}));

	return {
		...originalModule,
		roleGetListOptions: mockRoleGetListOptions,
		permissionsGetOptions: vi.fn(() => ({
			queryKey: ["permissions"],
			queryFn: async () => ({
				items: [],
				totalCount: 0,
			}),
		})),
		permissionsUpdateMutation: vi.fn(() => ({
			mutationFn: vi.fn(),
			onSuccess: vi.fn(),
			onError: vi.fn(),
		})),
		roleCreateMutation: vi.fn(() => ({
			mutationFn: vi.fn(),
			onSuccess: vi.fn(),
			onError: vi.fn(),
		})),
		roleUpdateMutation: vi.fn(() => ({
			mutationFn: vi.fn(),
			onSuccess: vi.fn(),
			onError: vi.fn(),
		})),
		roleDeleteMutation: vi.fn(() => ({
			mutationFn: vi.fn(),
			onSuccess: vi.fn(),
			onError: vi.fn(),
		})),
	};
});

vi.mock("@/features/roles/stores/role-form-store", () => ({
	useRoleFormStore: () => ({
		role: null,
		open: false,
		setLoading: vi.fn(),
		openCreateForm: vi.fn(),
		openEditForm: vi.fn(),
		closeForm: vi.fn(),
	}),
}));

vi.mock("@/features/roles/stores/permission-store", () => ({
	usePermissionModalStore: () => ({
		open: false,
		role: null,
		openModal: vi.fn(),
		closeModal: vi.fn(),
	}),
}));

vi.mock("../role-permissions-modal", () => ({
	RolePermissionsModal: () => null,
}));

vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

describe("RolesList", () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: { retry: false },
				mutations: { retry: false },
			},
		});
		vi.clearAllMocks();
	});

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);

	it("should render roles list", async () => {
		render(<RolesList />, { wrapper });

		const rolesTable = await screen.findByTestId("roles-table");
		expect(rolesTable).toBeInTheDocument();

		const adminElement = await screen.findByText("Admin");
		const userElement = await screen.findByText("User");

		expect(adminElement).toBeInTheDocument();
		expect(userElement).toBeInTheDocument();
	});

	it("should show loading state when loading", async () => {
		// Mock loading state by making queryFn return a promise that doesn't resolve immediately
		const { roleGetListOptions } = await import(
			"@/infrastructure/api/@tanstack/react-query.gen"
		);
		vi.mocked(roleGetListOptions).mockReturnValueOnce({
			queryKey: ["roles"],
			queryFn: () => new Promise(() => {}), // Never resolves, keeps loading
		} as unknown as ReturnType<typeof roleGetListOptions>);

		render(<RolesList />, { wrapper });

		// Should show skeleton loading elements
		await waitFor(() => {
			const skeletonContainer = document.querySelector(".space-y-3");
			expect(skeletonContainer).toBeInTheDocument();
		});
		const skeletonItems = document.querySelectorAll(".animate-pulse");
		expect(skeletonItems.length).toBeGreaterThan(0);
	});

	it("should have roles table", async () => {
		render(<RolesList />, { wrapper });

		const rolesTable = await screen.findByTestId("roles-table");
		expect(rolesTable).toBeInTheDocument();
	});
});
