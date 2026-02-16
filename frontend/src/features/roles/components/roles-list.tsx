import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import {
	roleCreateMutation,
	roleDeleteMutation,
	roleGetListOptions,
	roleGetListQueryKey,
	roleUpdateMutation,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import type { IdentityRoleDto } from "@/infrastructure/api/types.gen";
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
import { usePermissionModalStore } from "../stores/permission-store";
import { useRoleFormStore } from "../stores/role-form-store";
import { RoleForm, type RoleFormData } from "./role-form";
import { RolePermissionsModal } from "./role-permissions-modal";
import { RolesHeader } from "./roles-header";
import { RolesTable } from "./roles-table";

export function RolesList() {
	const [sorting, setSorting] = useState([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);

	const queryOptions = {
		query: {
			MaxResultCount: pagination.pageSize,
			SkipCount: pagination.pageIndex * pagination.pageSize,
		},
	};
	const queryClient = useQueryClient();

	const {
		role: editingRole,
		open: formOpen,
		setLoading,
		openCreateForm,
		openEditForm,
		closeForm,
	} = useRoleFormStore();

	const { openModal: openPermissionsModal } = usePermissionModalStore();

	const {
		data: rolesResponse,
		isLoading,
		error,
		isError,
	} = useQuery(roleGetListOptions(queryOptions));

	const createRoleMutation = useMutation({
		...roleCreateMutation(),
	});

	const updateRoleMutation = useMutation({
		...roleUpdateMutation(),
	});

	const deleteRoleMutation = useMutation({
		...roleDeleteMutation(),
	});

	const roles = rolesResponse?.items || [];
	const totalCount = rolesResponse?.totalCount || 0;

	const handleCreateRole = async (data: RoleFormData) => {
		try {
			setLoading(true);
			await createRoleMutation.mutateAsync({
				body: {
					name: data.name,
					isDefault: data.isDefault,
					isPublic: data.isPublic,
				},
			});
			queryClient.invalidateQueries({
				queryKey: roleGetListQueryKey(queryOptions),
			});
			toast.success("Role created successfully");
			closeForm();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to create role";
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateRole = async (data: RoleFormData) => {
		if (!editingRole?.id) return;
		try {
			setLoading(true);
			await updateRoleMutation.mutateAsync({
				path: { id: editingRole.id },
				body: {
					name: data.name,
					isDefault: data.isDefault,
					isPublic: data.isPublic,
					concurrencyStamp: editingRole.concurrencyStamp || null,
				},
			});
			queryClient.invalidateQueries({
				queryKey: roleGetListQueryKey(queryOptions),
			});
			toast.success("Role updated successfully");
			closeForm();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to update role";
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteRole = async (roleId: string) => {
		try {
			await deleteRoleMutation.mutateAsync({
				path: { id: roleId },
			});
			queryClient.invalidateQueries({
				queryKey: roleGetListQueryKey(queryOptions),
			});
			toast.success("Role deleted successfully");
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to delete role";
			toast.error(errorMessage);
			throw error;
		}
	};

	const handleEditRole = (role: IdentityRoleDto) => {
		openEditForm(role);
	};

	const handleCreateNewRole = () => {
		openCreateForm();
	};

	const handleOpenPermissions = (role: IdentityRoleDto) => {
		openPermissionsModal(role);
	};

	const handleOpenDeleteDialog = (roleId: string) => {
		setDeleteRoleId(roleId);
	};

	const handleConfirmDelete = () => {
		if (deleteRoleId) {
			handleDeleteRole(deleteRoleId);
		}
	};

	if (isError) {
		return (
			<Alert variant="destructive">
				<AlertDescription>
					Failed to load roles: {error?.error?.message || "Unknown error"}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-4">
			<RolesHeader
				totalCount={totalCount}
				onCreateRole={handleCreateNewRole}
				isCreating={createRoleMutation.isPending}
			/>

			<RolesTable
				roles={roles}
				isLoading={isLoading}
				sorting={sorting}
				pagination={pagination}
				totalCount={totalCount}
				onSortingChange={setSorting}
				onPaginationChange={setPagination}
				onEditRole={handleEditRole}
				onOpenPermissions={handleOpenPermissions}
				onDeleteRole={handleOpenDeleteDialog}
				isDeleting={deleteRoleMutation.isPending}
			/>

			<RoleForm
				key={editingRole?.id || "create"}
				role={editingRole}
				open={formOpen}
				onOpenChange={closeForm}
				onSubmit={editingRole ? handleUpdateRole : handleCreateRole}
				isLoading={createRoleMutation.isPending || updateRoleMutation.isPending}
				mode={editingRole ? "edit" : "create"}
			/>
			<RolePermissionsModal />

			<AlertDialog
				open={!!deleteRoleId}
				onOpenChange={() => setDeleteRoleId(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Role</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this role? This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							data-testid="confirm-delete-btn"
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
