import { useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {
	getApiPermissionManagementPermissionsOptions,
	putApiPermissionManagementPermissionsMutation,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import { PERMISSION_ADMIN_LABELS } from "@/features/permission-admin/constants";
import { usePermissionAdminStore } from "@/features/permission-admin/stores/permission-admin-store";
import {
	type PermissionGroup,
	convertToUpdatePermissionsDto,
	groupPermissionsFromApi,
} from "@/features/roles/hooks/permission-utils";
import { PageHeader } from "@/shared/components/page-header";
import { PageLayout } from "@/shared/components/page-layout";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { PermissionGroup as PermissionGroupCard } from "@/shared/components/permission-group";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function PermissionAdminPage() {
	const providerName = PERMISSION_ADMIN_LABELS.PROVIDER_NAME || undefined;
	const {
		permissions,
		filteredPermissions,
		searchTerm,
		setFromApi,
		setSearchTerm,
		updateGroup,
		updatePermission,
	} = usePermissionAdminStore();

	const { data, isLoading, refetch } = useQuery({
		...getApiPermissionManagementPermissionsOptions({
			query: providerName
				? {
						providerName,
					}
				: undefined,
		}),
	});

	const updateMutation = useMutation({
		...putApiPermissionManagementPermissionsMutation(),
	});

	useEffect(() => {
		if (data?.groups) {
			setFromApi(data.groups);
		}
	}, [data?.groups, setFromApi]);

	const grouped = useMemo(() => {
		const validGroups: PermissionGroup[] = (data?.groups || []).reduce(
			(list, group) => {
				const name = group.name ?? group.displayName;
				if (!name) return list;
				list.push({
					name,
					displayName: group.displayName ?? undefined,
					permissions: group.permissions ?? [],
				});
				return list;
			},
			[] as PermissionGroup[],
		);
		return groupPermissionsFromApi(filteredPermissions, validGroups);
	}, [data?.groups, filteredPermissions]);

	const handleSave = async () => {
		if (!permissions.length) return;
		try {
			await updateMutation.mutateAsync({
				body: convertToUpdatePermissionsDto(permissions),
				query: providerName
					? {
							providerName,
						}
					: undefined,
			});
			await refetch();
			toast.success(PERMISSION_ADMIN_LABELS.SUCCESS);
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : PERMISSION_ADMIN_LABELS.ERROR;
			toast.error(message);
		}
	};

	const handleReset = () => {
		if (data?.groups) {
			setFromApi(data.groups);
		}
	};

	const isSaving = updateMutation.isPending;
	const hasData = Object.keys(grouped).length > 0;

	return (
		<PageLayout>
			<PageHeader
				title={PERMISSION_ADMIN_LABELS.TITLE}
				description={PERMISSION_ADMIN_LABELS.DESCRIPTION}
			/>
			<div className="flex items-center justify-end gap-2 mb-4">
				<Button variant="outline" onClick={handleReset} disabled={isLoading}>
					{PERMISSION_ADMIN_LABELS.RESET}
				</Button>
				<Button onClick={handleSave} disabled={isLoading || isSaving}>
					{isSaving
						? PERMISSION_ADMIN_LABELS.SAVING
						: PERMISSION_ADMIN_LABELS.SAVE}
				</Button>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex items-center">
					<Input
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
						placeholder={PERMISSION_ADMIN_LABELS.SEARCH_PLACEHOLDER}
					/>
				</div>

				{isLoading ? (
					<div className="space-y-3">
						{["row-1", "row-2", "row-3"].map((rowKey) => (
							<div
								className="border rounded-lg p-4 bg-card"
								key={`permission-skeleton-${rowKey}`}
							>
								<Skeleton className="h-5 w-32 mb-2" />
								{["col-1", "col-2", "col-3"].map((colKey) => (
									<Skeleton
										className="h-4 w-48 mb-2"
										key={`permission-skeleton-${rowKey}-${colKey}`}
									/>
								))}
							</div>
						))}
					</div>
				) : hasData ? (
					<ScrollArea className="h-[70vh] pr-4">
						<div className="space-y-4">
							{Object.entries(grouped).map(([groupName, permissionList]) => (
								<PermissionGroupCard
									key={groupName}
									groupName={groupName}
									permissions={permissionList}
									onPermissionChange={updatePermission}
									onGroupChange={updateGroup}
								/>
							))}
						</div>
					</ScrollArea>
				) : (
					<div className="text-center py-10 text-muted-foreground">
						{searchTerm
							? PERMISSION_ADMIN_LABELS.EMPTY_FILTERED
							: PERMISSION_ADMIN_LABELS.EMPTY}
					</div>
				)}
			</div>
		</PageLayout>
	);
}
