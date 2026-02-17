import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import {
	postApiIdentityUsersMutation,
	deleteApiIdentityUsersByIdMutation,
	getApiIdentityUsersOptions,
	getApiIdentityUsersQueryKey,
	putApiIdentityUsersByIdMutation,
	putApiIdentityUsersByIdRolesMutation,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import type { IdentityUserDto } from "@/infrastructure/api/types.gen";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import { useUserFormStore } from "../stores/user-form-store";
import { useUserPermissionModalStore } from "../stores/user-permission-store";
import { UserForm, type UserFormData } from "./user-form";
import { UserPermissionsModal } from "./user-permissions-modal";
import { UsersHeader } from "./users-header";
import { UsersTable } from "./users-table";

export function UsersList() {
	const [sorting, setSorting] = useState([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
	const [searchValue, setSearchValue] = useState("");
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

	const queryOptions = {
		query: {
			MaxResultCount: pagination.pageSize,
			SkipCount: pagination.pageIndex * pagination.pageSize,
			...(searchValue && { Filter: searchValue }),
		},
	};
	const queryClient = useQueryClient();

	const {
		user: editingUser,
		setLoading,
		openEditForm,
		openCreateForm,
		closeForm,
	} = useUserFormStore();

	const { openModal: openPermissionsModal } = useUserPermissionModalStore();

	const {
		data: usersResponse,
		isLoading,
		error,
		isError,
	} = useQuery(getApiIdentityUsersOptions(queryOptions));

	const createUserMutation = useMutation({
		...postApiIdentityUsersMutation(),
	});

	const updateUserMutation = useMutation({
		...putApiIdentityUsersByIdMutation(),
	});

	const _updateUserRolesMutation = useMutation({
		...putApiIdentityUsersByIdRolesMutation(),
	});

	const deleteUserMutation = useMutation({
		...deleteApiIdentityUsersByIdMutation(),
	});

	const users = usersResponse?.items || [];
	const totalCount = usersResponse?.totalCount || 0;

	const handleCreateUser = async (data: UserFormData) => {
		try {
			setLoading(true);
			await createUserMutation.mutateAsync({
				body: {
					userName: data.userName,
					name: data.name || null,
					surname: data.surname || null,
					email: data.email,
					phoneNumber: data.phoneNumber || null,
					isActive: data.isActive,
					lockoutEnabled: data.lockoutEnabled,
					password: data.password || "",
				},
			});
			queryClient.invalidateQueries({
				queryKey: getApiIdentityUsersQueryKey(queryOptions),
			});
			toast.success("User created successfully");
			closeForm();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to create user";
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateUser = async (data: UserFormData) => {
		if (!editingUser?.id) return;
		try {
			setLoading(true);
			await updateUserMutation.mutateAsync({
				path: { id: editingUser.id },
				body: {
					userName: data.userName,
					name: data.name || null,
					surname: data.surname || null,
					email: data.email,
					phoneNumber: data.phoneNumber || null,
					isActive: data.isActive,
					lockoutEnabled: data.lockoutEnabled,
					password: data.password || null,
					concurrencyStamp: editingUser.concurrencyStamp || null,
				},
			});

			// Update user roles if they are provided
			if (data.roles && Array.isArray(data.roles)) {
				await _updateUserRolesMutation.mutateAsync({
					path: { id: editingUser.id },
					body: {
						roleNames: data.roles,
					},
				});
			}

			// Invalidate and refetch user list to update table
			await queryClient.invalidateQueries({
				queryKey: getApiIdentityUsersQueryKey(queryOptions),
			});
			// Also force a refetch to ensure immediate UI update
			await queryClient.refetchQueries({
				queryKey: getApiIdentityUsersQueryKey(queryOptions),
			});
			toast.success("User updated successfully");
			closeForm();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to update user";
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteUser = async (userId: string) => {
		try {
			await deleteUserMutation.mutateAsync({
				path: { id: userId },
			});
			queryClient.invalidateQueries({
				queryKey: getApiIdentityUsersQueryKey(queryOptions),
			});
			toast.success("User deleted successfully");
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to delete user";
			toast.error(errorMessage);
			throw error;
		}
	};

	const handleConfirmDelete = async () => {
		if (deleteUserId === "bulk") {
			// Handle bulk delete
			try {
				await Promise.all(
					selectedUsers.map((userId) =>
						deleteUserMutation.mutateAsync({
							path: { id: userId },
						}),
					),
				);
				queryClient.invalidateQueries({
					queryKey: getApiIdentityUsersQueryKey(queryOptions),
				});
				toast.success("Users deleted successfully");
				setSelectedUsers([]);
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error ? error.message : "Failed to delete users";
				toast.error(errorMessage);
			}
		} else if (deleteUserId) {
			await handleDeleteUser(deleteUserId);
		}
		setDeleteUserId(null);
	};

	const handleEditUser = (user: IdentityUserDto) => {
		openEditForm(user);
	};

	const handleCreateNewUser = () => {
		openCreateForm();
	};

	const handleOpenPermissions = (user: IdentityUserDto) => {
		openPermissionsModal(user);
	};

	const handleOpenDeleteDialog = (userId: string) => {
		setDeleteUserId(userId);
	};

	if (isError) {
		return (
			<Alert variant="destructive">
				<AlertDescription>
					Failed to load users: {error?.error?.message || "Unknown error"}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-4">
			<UsersHeader
				totalCount={totalCount}
				onCreateUser={handleCreateNewUser}
				isCreating={createUserMutation.isPending}
				onSearchChange={(value: string) => setSearchValue(value)}
				searchValue={searchValue}
			/>

			{/* Bulk Actions */}
			{selectedUsers.length > 0 && (
				<div
					className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 bg-muted rounded-lg"
					data-testid="bulk-actions"
				>
					<span className="text-sm text-muted-foreground">
						{selectedUsers.length} user(s) selected
					</span>
					<Button
						variant="destructive"
						size="sm"
						data-testid="bulk-delete-btn"
						onClick={() => setDeleteUserId("bulk")}
						disabled={deleteUserMutation.isPending}
						className="w-full sm:w-auto"
					>
						{deleteUserMutation.isPending ? "Deleting..." : "Delete Selected"}
					</Button>
				</div>
			)}

			<UsersTable
				users={users}
				isLoading={isLoading}
				sorting={sorting}
				pagination={pagination}
				totalCount={totalCount}
				onSortingChange={(sorting) => setSorting(sorting)}
				onPaginationChange={(pagination) => setPagination(pagination)}
				onEditUser={handleEditUser}
				onOpenPermissions={handleOpenPermissions}
				onDeleteUser={handleOpenDeleteDialog}
				isDeleting={deleteUserMutation.isPending}
				selectedUsers={selectedUsers}
				onSelectedUsersChange={(userIds: string[]) => setSelectedUsers(userIds)}
			/>

			<UserForm
				key={editingUser?.id || "create"}
				user={editingUser}
				onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
				isLoading={createUserMutation.isPending || updateUserMutation.isPending}
				mode={editingUser ? "edit" : "create"}
			/>
			<UserPermissionsModal />

			<AlertDialog
				open={!!deleteUserId}
				onOpenChange={() => setDeleteUserId(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{deleteUserId === "bulk" ? "Delete Users" : "Delete User"}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{deleteUserId === "bulk"
								? `Are you sure you want to delete ${selectedUsers.length} selected user(s)? This action cannot be undone.`
								: "Are you sure you want to delete this user? This action cannot be undone."}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							data-testid={
								deleteUserId === "bulk"
									? "confirm-bulk-delete-btn"
									: "confirm-delete-btn"
							}
							onClick={handleConfirmDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
