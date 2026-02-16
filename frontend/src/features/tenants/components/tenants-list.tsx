import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
	tenantCreateMutation,
	tenantDeleteMutation,
	tenantGetListOptions,
	tenantGetListQueryKey,
	tenantUpdateMutation,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import type { TenantDto } from "@/infrastructure/api/types.gen";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { useTenantConnectionStore } from "../stores/tenant-connection-store";
import { useTenantFormStore } from "../stores/tenant-form-store";
import { TenantConnectionStringModal } from "./tenant-connection-string-modal";
import { TenantForm, type TenantFormData } from "./tenant-form";
import { TenantsHeader } from "./tenants-header";
import { TenantsTable } from "./tenants-table";
import { TenantFeaturesModal } from "./tenant-features-modal";

export function TenantsList() {
	const [sorting, setSorting] = useState([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const queryOptions = {
		query: {
			MaxResultCount: pagination.pageSize,
			SkipCount: pagination.pageIndex * pagination.pageSize,
		},
	};
	const queryClient = useQueryClient();

	const {
		tenant: editingTenant,
		open: formOpen,
		setLoading,
		openCreateForm,
		openEditForm,
		closeForm,
	} = useTenantFormStore();

	const { openModal: openConnectionStringModal } = useTenantConnectionStore();
	const [featuresTenant, setFeaturesTenant] = useState<TenantDto | null>(null);

	const {
		data: tenantsResponse,
		isLoading,
		error,
		isError,
	} = useQuery(tenantGetListOptions(queryOptions));

	const createTenantMutation = useMutation({
		...tenantCreateMutation(),
	});

	const updateTenantMutation = useMutation({
		...tenantUpdateMutation(),
	});

	const deleteTenantMutation = useMutation({
		...tenantDeleteMutation(),
	});

	const tenants = tenantsResponse?.items || [];
	const totalCount = tenantsResponse?.totalCount || 0;

	const handleCreateTenant = async (data: TenantFormData) => {
		try {
			setLoading(true);
			await createTenantMutation.mutateAsync({
				body: {
					name: data.name,
					adminEmailAddress: data.adminEmailAddress || "",
					adminPassword: data.adminPassword || "",
				},
			});
			queryClient.invalidateQueries({
				queryKey: tenantGetListQueryKey(queryOptions),
			});
			toast.success("Tenant created successfully");
			closeForm();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to create tenant";
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateTenant = async (data: TenantFormData) => {
		if (!editingTenant?.id) return;
		try {
			setLoading(true);
			await updateTenantMutation.mutateAsync({
				path: { id: editingTenant.id },
				body: {
					name: data.name,
					concurrencyStamp: editingTenant.concurrencyStamp || null,
				},
			});
			queryClient.invalidateQueries({
				queryKey: tenantGetListQueryKey(queryOptions),
			});
			toast.success("Tenant updated successfully");
			closeForm();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to update tenant";
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteTenant = async (tenantId: string) => {
		try {
			await deleteTenantMutation.mutateAsync({
				path: { id: tenantId },
			});
			queryClient.invalidateQueries({
				queryKey: tenantGetListQueryKey(queryOptions),
			});
			toast.success("Tenant deleted successfully");
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to delete tenant";
			toast.error(errorMessage);
			throw error;
		}
	};

	const handleEditTenant = (tenant: TenantDto) => {
		openEditForm(tenant);
	};

	const handleCreateNewTenant = () => {
		openCreateForm();
	};

	const handleOpenConnectionString = (tenant: TenantDto) => {
		openConnectionStringModal(tenant);
	};

	const handleManageFeatures = (tenant: TenantDto) => {
		setFeaturesTenant(tenant);
	};

	const handleCloseFeatures = () => {
		setFeaturesTenant(null);
	};

	if (isError) {
		return (
			<Alert variant="destructive">
				<AlertDescription>
					Failed to load tenants: {error?.error?.message || "Unknown error"}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-4">
			<TenantsHeader
				totalCount={totalCount}
				onCreateTenant={handleCreateNewTenant}
				isCreating={createTenantMutation.isPending}
			/>
			<TenantsTable
				tenants={tenants}
				isLoading={isLoading}
				sorting={sorting}
				pagination={pagination}
				totalCount={totalCount}
				onSortingChange={setSorting}
				onPaginationChange={setPagination}
				onEditTenant={handleEditTenant}
				onOpenConnectionString={handleOpenConnectionString}
				onManageFeatures={handleManageFeatures}
				onDeleteTenant={handleDeleteTenant}
				isDeleting={deleteTenantMutation.isPending}
			/>

			<TenantForm
				key={editingTenant?.id || "create"}
				tenant={editingTenant || undefined}
				open={formOpen}
				onOpenChange={closeForm}
				onSubmit={editingTenant ? handleUpdateTenant : handleCreateTenant}
				isLoading={
					createTenantMutation.isPending || updateTenantMutation.isPending
				}
				mode={editingTenant ? "edit" : "create"}
			/>
			<TenantConnectionStringModal />
			<TenantFeaturesModal
				tenant={featuresTenant || undefined}
				open={!!featuresTenant}
				onOpenChange={(open) => {
					if (!open) handleCloseFeatures();
				}}
			/>
		</div>
	);
}
