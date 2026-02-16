import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
	useMutation,
} from "@tanstack/react-query";
import {
	getApiIdentityUsersOptions,
	postApiIdentityUsersMutation,
	putApiIdentityUsersByIdMutation,
	deleteApiIdentityUsersByIdMutation,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import type {
	IdentityUserCreateDto,
	IdentityUserUpdateDto,
} from "@/infrastructure/api/types.gen";

describe.skip("User Management Workflow Integration", () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
					gcTime: 0,
				},
				mutations: {
					retry: false,
				},
			},
		});
	});

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);

	it("should complete full user CRUD workflow", async () => {
		const user = userEvent.setup();

		// Mock component that demonstrates the workflow
		function UserManagementWorkflow() {
			const [workflowStep, setWorkflowStep] = React.useState<
				"list" | "create" | "update" | "delete"
			>("list");
			const [selectedUserId, setSelectedUserId] = React.useState<string | null>(
				null,
			);

			// Queries
			const { data: usersList, refetch: refetchUsers } = useQuery(
				getApiIdentityUsersOptions({
					query: { MaxResultCount: 10, SkipCount: 0 },
				}),
			);

			// Mutations
			const createMutation = useMutation(postApiIdentityUsersMutation());
			const updateMutation = useMutation(putApiIdentityUsersByIdMutation());
			const deleteMutation = useMutation(deleteApiIdentityUsersByIdMutation());

			const handleCreateUser = async () => {
				const userData: IdentityUserCreateDto = {
					userName: "integration-test-user",
					email: "integration@example.com",
					name: "Integration",
					surname: "Test",
					password: "TestPass123!",
				};

				await createMutation.mutateAsync({
					body: userData,
				});

				setWorkflowStep("update");
				await refetchUsers();
			};

			const handleUpdateUser = async () => {
				if (!usersList?.items?.[0]?.id) return;

				const updateData: IdentityUserUpdateDto = {
					userName: "updated-integration",
					name: "Updated Integration",
					surname: "Updated Test",
					email: "updated-integration@example.com",
				};

				await updateMutation.mutateAsync({
					path: { id: usersList.items[0].id },
					body: updateData,
				});

				setSelectedUserId(usersList.items[0].id);
				setWorkflowStep("delete");
				await refetchUsers();
			};

			const handleDeleteUser = async () => {
				if (!selectedUserId) return;

				await deleteMutation.mutateAsync({
					path: { id: selectedUserId },
				});

				setWorkflowStep("list");
				await refetchUsers();
			};

			return (
				<div>
					<div data-testid="workflow-step">{workflowStep}</div>
					<div data-testid="users-count">{usersList?.totalCount ?? 0}</div>

					{workflowStep === "list" && (
						<button
							type="button"
							onClick={handleCreateUser}
							data-testid="create-user-btn"
						>
							Create User
						</button>
					)}

					{workflowStep === "create" && createMutation.isPending && (
						<div data-testid="creating">Creating...</div>
					)}

					{workflowStep === "update" && (
						<button
							type="button"
							onClick={handleUpdateUser}
							data-testid="update-user-btn"
						>
							Update User
						</button>
					)}

					{workflowStep === "update" && updateMutation.isPending && (
						<div data-testid="updating">Updating...</div>
					)}

					{workflowStep === "delete" && (
						<button
							type="button"
							onClick={handleDeleteUser}
							data-testid="delete-user-btn"
						>
							Delete User
						</button>
					)}

					{workflowStep === "delete" && deleteMutation.isPending && (
						<div data-testid="deleting">Deleting...</div>
					)}
				</div>
			);
		}

		render(<UserManagementWorkflow />, { wrapper });

		// Initial state - should show list step
		expect(screen.getByTestId("workflow-step")).toHaveTextContent("list");

		// Click create user button
		await user.click(screen.getByTestId("create-user-btn"));

		// Should show creating state
		await waitFor(() => {
			expect(screen.getByTestId("creating")).toBeInTheDocument();
		});

		// Wait for creation to complete and move to update step
		await waitFor(() => {
			expect(screen.getByTestId("workflow-step")).toHaveTextContent("update");
		});

		// User count should increase

		// Click update user button
		await user.click(screen.getByTestId("update-user-btn"));

		// Should show updating state
		await waitFor(() => {
			expect(screen.getByTestId("updating")).toBeInTheDocument();
		});

		// Wait for update to complete and move to delete step
		await waitFor(() => {
			expect(screen.getByTestId("workflow-step")).toHaveTextContent("delete");
		});

		// Click delete user button
		await user.click(screen.getByTestId("delete-user-btn"));

		// Should show deleting state
		await waitFor(() => {
			expect(screen.getByTestId("deleting")).toBeInTheDocument();
		});

		// Wait for deletion to complete and return to list step
		await waitFor(() => {
			expect(screen.getByTestId("workflow-step")).toHaveTextContent("list");
		});
	});

	it("should handle workflow errors gracefully", async () => {
		const user = userEvent.setup();

		function ErrorWorkflow() {
			const [error, setError] = React.useState<string | null>(null);

			const createMutation = useMutation(postApiIdentityUsersMutation());

			const handleCreateInvalidUser = async () => {
				try {
					await createMutation.mutateAsync({
						body: {
							userName: "", // Invalid
							email: "invalid-email", // Invalid
							password: "123", // Invalid
						} as unknown as IdentityUserCreateDto, // Intentionally invalid data for error testing
					});
				} catch (_err) {
					setError("Failed to create user");
				}
			};

			return (
				<div>
					<div data-testid="error-message">{error}</div>
					<button
						type="button"
						onClick={handleCreateInvalidUser}
						data-testid="create-invalid-btn"
					>
						Create Invalid User
					</button>
				</div>
			);
		}

		render(<ErrorWorkflow />, { wrapper });

		// Click create invalid user button
		await user.click(screen.getByTestId("create-invalid-btn"));

		// Should show error message
		await waitFor(() => {
			expect(screen.getByTestId("error-message")).toHaveTextContent(
				"Failed to create user",
			);
		});
	});

	it("should handle concurrent operations", async () => {
		const user = userEvent.setup();

		function ConcurrentOperations() {
			const [operations, setOperations] = React.useState<string[]>([]);

			const createMutation1 = useMutation(postApiIdentityUsersMutation());
			const createMutation2 = useMutation(postApiIdentityUsersMutation());

			const handleConcurrentCreates = async () => {
				setOperations([]);

				const promises = [
					createMutation1
						.mutateAsync({
							body: {
								userName: "concurrent-user-1",
								email: "concurrent1@example.com",
								name: "Concurrent",
								surname: "User1",
								password: "TestPass123!",
							},
						})
						.then(() => setOperations((prev) => [...prev, "create1"])),

					createMutation2
						.mutateAsync({
							body: {
								userName: "concurrent-user-2",
								email: "concurrent2@example.com",
								name: "Concurrent",
								surname: "User2",
								password: "TestPass123!",
							},
						})
						.then(() => setOperations((prev) => [...prev, "create2"])),
				];

				await Promise.all(promises);
			};

			return (
				<div>
					<div data-testid="operations-count">{operations.length}</div>
					<button
						type="button"
						onClick={handleConcurrentCreates}
						data-testid="concurrent-create-btn"
					>
						Create Concurrent Users
					</button>
				</div>
			);
		}

		render(<ConcurrentOperations />, { wrapper });

		// Click concurrent create button
		await user.click(screen.getByTestId("concurrent-create-btn"));

		// Should complete both operations
		await waitFor(() => {
			expect(screen.getByTestId("operations-count")).toHaveTextContent("2");
		});
	});
});
