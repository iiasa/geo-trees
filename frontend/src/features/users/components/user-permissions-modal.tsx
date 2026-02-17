import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IconSearch, IconShield } from "@tabler/icons-react";
import { toast } from "sonner";

import {
	getApiPermissionManagementPermissionsOptions,
	putApiPermissionManagementPermissionsMutation,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/components/ui/dialog";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { useUserPermissionModalStore } from "../stores/user-permission-store";
import {
	groupPermissionsFromApi,
	convertToUpdatePermissionsDto,
} from "../../roles/hooks/permission-utils";
import { PermissionGroup } from "../../../shared/components/permission-group";
import type { PermissionGrantInfoDto } from "@/infrastructure/api/types.gen";

export function UserPermissionsModal() {
	const {
		open,
		user,
		allPermissions,
		filteredPermissions,
		searchTerm,
		isLoading,
		isSaving,
		error,
		setAllPermissions,
		setUserPermissions,
		setSearchTerm,
		setApiGroups,
		updatePermission,
		updateGroupPermissions,
		setLoading,
		setSaving,
		setError,
		closeModal,
	} = useUserPermissionModalStore();

	// Fetch all available permissions and user-specific permissions in one call
	const {
		data: permissionsResponse,
		isLoading: isPermissionsLoading,
		error: permissionsError,
		refetch: refetchPermissions,
	} = useQuery({
		...getApiPermissionManagementPermissionsOptions({
			query: {
				providerName: "U",
				providerKey: user?.id || "",
			},
		}),
		enabled: !!user?.id, // Only run the query if we have a user ID
	});

	// Update permissions mutation
	const updatePermissionsMutation = useMutation({
		...putApiPermissionManagementPermissionsMutation(),
	});

	// Process permissions response when it loads
	useEffect(() => {
		if (permissionsResponse && user?.id) {
			// Extract all permissions from groups in response
			const allPermissions: PermissionGrantInfoDto[] = [];
			const userPermissions: PermissionGrantInfoDto[] = [];

			if (permissionsResponse.groups) {
				// Set the API groups for mapping
				setApiGroups(permissionsResponse.groups);

				permissionsResponse.groups.forEach((group) => {
					if (group.permissions) {
						// Add all permissions to the allPermissions list
						allPermissions.push(...group.permissions);

						// Add granted permissions to the userPermissions list
						group.permissions.forEach((permission) => {
							if (permission.isGranted) {
								userPermissions.push(permission);
							}
						});
					}
				});
			}

			setAllPermissions(allPermissions);
			setUserPermissions(userPermissions);
		}
	}, [
		permissionsResponse,
		user?.id,
		setAllPermissions,
		setUserPermissions,
		setApiGroups,
	]);

	// Update loading state based on query state
	useEffect(() => {
		setLoading(isPermissionsLoading);
	}, [isPermissionsLoading, setLoading]);

	// Handle errors
	useEffect(() => {
		if (permissionsError) {
			setError(permissionsError.error?.message || "Failed to load permissions");
		}
	}, [permissionsError, setError]);

	// Handle save permissions
	const handleSavePermissions = async () => {
		if (!user?.id) return;

		try {
			setSaving(true);
			setError(null);

			// Convert permissions to the format expected by the API
			const updateData = convertToUpdatePermissionsDto(allPermissions);

			await updatePermissionsMutation.mutateAsync({
				query: {
					providerName: "U",
					providerKey: user.id,
				},
				body: updateData,
			});

			// Refetch permissions to get the updated state
			await refetchPermissions();

			toast.success("User permissions updated successfully");
			closeModal();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to update permissions";
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setSaving(false);
		}
	};

	// Group permissions for display
	const apiGroups = useUserPermissionModalStore.getState().apiGroups;
	const validGroups = apiGroups
		.filter(
			(group): group is typeof group & { name: string } =>
				group.name !== null && group.name !== undefined,
		)
		.map((group) => ({
			name: group.name,
			displayName: group.displayName || undefined,
			permissions: group.permissions || undefined,
		}));
	const groupedPermissions = filteredPermissions.length
		? groupPermissionsFromApi(filteredPermissions, validGroups)
		: {};

	return (
		<Dialog open={open} onOpenChange={closeModal}>
			<DialogContent
				className="max-w-4xl h-[85vh] flex flex-col overflow-hidden p-0"
				data-testid="user-permissions-modal"
			>
				<DialogHeader className="p-6 pb-2 flex-shrink-0">
					<DialogTitle className="flex items-center gap-2">
						<IconShield className="h-5 w-5" />
						User Permissions
					</DialogTitle>
					<DialogDescription>
						Manage permissions for user: <strong>{user?.userName}</strong>
					</DialogDescription>
				</DialogHeader>

				{error && (
					<div className="px-6 pb-2 flex-shrink-0">
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					</div>
				)}

				<div className="flex items-center space-x-2 px-6 pb-4 flex-shrink-0">
					<div className="relative flex-1">
						<IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search permissions..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-8"
						/>
					</div>
				</div>

				<div className="flex-1 overflow-hidden px-6">
					<ScrollArea className="h-full">
						<div className="pb-6">
							{isLoading ? (
								<div className="space-y-4">
									{Array.from({ length: 5 }).map(() => (
										<div key={crypto.randomUUID()} className="space-y-2">
											<Skeleton className="h-6 w-48" />
											<div className="space-y-2 pl-4">
												{Array.from({ length: 3 }).map(() => (
													<Skeleton
														key={crypto.randomUUID()}
														className="h-8 w-full"
													/>
												))}
											</div>
										</div>
									))}
								</div>
							) : Object.keys(groupedPermissions).length > 0 ? (
								<div className="space-y-4">
									{Object.entries(groupedPermissions).map(
										([groupName, permissions]) => (
											<PermissionGroup
												key={groupName}
												groupName={groupName}
												permissions={permissions}
												onPermissionChange={updatePermission}
												onGroupChange={updateGroupPermissions}
											/>
										),
									)}
								</div>
							) : (
								<div className="text-center py-8 text-muted-foreground">
									{searchTerm
										? "No permissions found matching your search."
										: "No permissions available."}
								</div>
							)}
						</div>
					</ScrollArea>
				</div>

				<DialogFooter className="p-6 pt-2 flex-shrink-0">
					<Button
						type="button"
						variant="outline"
						onClick={closeModal}
						disabled={isSaving}
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleSavePermissions}
						disabled={isSaving || isLoading}
					>
						{isSaving ? "Saving..." : "Save Changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
