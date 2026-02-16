import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IconSearch, IconShield, IconX } from "@tabler/icons-react";
import { toast } from "sonner";

import {
	permissionsGetOptions,
	permissionsUpdateMutation,
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
import { usePermissionModalStore } from "../stores/permission-store";
import {
	groupPermissionsFromApi,
	convertToUpdatePermissionsDto,
} from "../hooks/permission-utils";
import { PermissionGroup } from "../../../shared/components/permission-group";
import type { PermissionGrantInfoDto } from "@/infrastructure/api/types.gen";

export function RolePermissionsModal() {
	const {
		open,
		role,
		allPermissions,
		filteredPermissions,
		searchTerm,
		isLoading,
		isSaving,
		error,
		setAllPermissions,
		setRolePermissions,
		setSearchTerm,
		setApiGroups,
		updatePermission,
		updateGroupPermissions,
		setLoading,
		setSaving,
		setError,
		closeModal,
	} = usePermissionModalStore();

	// Fetch all available permissions and role-specific permissions in one call
	const {
		data: permissionsResponse,
		isLoading: isPermissionsLoading,
		error: permissionsError,
		refetch: refetchPermissions,
	} = useQuery({
		...permissionsGetOptions({
			query: {
				providerName: "R",
				providerKey: role?.id || "",
			},
		}),
		enabled: !!role?.id, // Only run the query if we have a role ID
	});

	// Update permissions mutation
	const updatePermissionsMutation = useMutation({
		...permissionsUpdateMutation(),
	});

	// Process permissions response when it loads
	useEffect(() => {
		if (permissionsResponse && role?.id) {
			// Extract all permissions from groups in response
			const allPermissions: PermissionGrantInfoDto[] = [];
			const rolePermissions: PermissionGrantInfoDto[] = [];

			if (permissionsResponse.groups) {
				// Set the API groups for mapping
				setApiGroups(permissionsResponse.groups);

				permissionsResponse.groups.forEach((group) => {
					if (group.permissions) {
						// Add all permissions to the allPermissions list
						allPermissions.push(...group.permissions);

						// Add granted permissions to the rolePermissions list
						group.permissions.forEach((permission) => {
							if (permission.isGranted) {
								rolePermissions.push(permission);
							}
						});
					}
				});
			}

			setAllPermissions(allPermissions);
			setRolePermissions(rolePermissions);
		}
	}, [
		permissionsResponse,
		role?.id,
		setAllPermissions,
		setRolePermissions,
		setApiGroups,
	]);

	// Update loading state
	useEffect(() => {
		setLoading(isPermissionsLoading);
	}, [isPermissionsLoading, setLoading]);

	// Update error state
	useEffect(() => {
		if (permissionsError) {
			setError("Failed to load permissions");
		} else {
			setError(null);
		}
	}, [permissionsError, setError]);

	// Handle search term change
	const handleSearchChange = (term: string) => {
		setSearchTerm(term);
	};

	// Handle permission change
	const handlePermissionChange = (
		permissionName: string,
		isGranted: boolean,
	) => {
		updatePermission(permissionName, isGranted);
	};

	// Handle group permission change
	const handleGroupPermissionChange = (
		groupName: string,
		isGranted: boolean,
	) => {
		updateGroupPermissions(groupName, isGranted);
	};

	// Save permissions
	const handleSavePermissions = async () => {
		if (!role?.id) return;

		try {
			setSaving(true);
			await updatePermissionsMutation.mutateAsync({
				query: {
					providerName: "R",
					providerKey: role.id,
				},
				body: convertToUpdatePermissionsDto(allPermissions),
			});

			// Refetch permissions to get the latest state
			await refetchPermissions();

			toast.success("Permissions updated successfully");
			closeModal();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to update permissions";
			toast.error(errorMessage);
		} finally {
			setSaving(false);
		}
	};

	// Handle modal close
	const handleClose = () => {
		if (isSaving) return;
		closeModal();
	};

	// Group filtered permissions using API groups, filtering out groups without names
	const validGroups = (permissionsResponse?.groups || [])
		.filter(
			(group): group is typeof group & { name: string } =>
				group.name !== null && group.name !== undefined,
		)
		.map((group) => ({
			name: group.name,
			displayName: group.displayName || undefined,
			permissions: group.permissions || undefined,
		}));
	const groupedPermissions = groupPermissionsFromApi(
		filteredPermissions,
		validGroups,
	);

	return (
		<Dialog open={open} onOpenChange={closeModal}>
			<DialogContent
				className="max-w-5xl h-[85vh] flex flex-col"
				data-testid="permissions-modal"
			>
				<DialogHeader className="flex-shrink-0">
					<div className="flex items-center gap-2">
						<IconShield className="h-5 w-5" />
						<DialogTitle>Manage Permissions</DialogTitle>
					</div>
					<DialogDescription>
						{role ? (
							<>
								Configure permissions for role: <strong>{role.name}</strong>
							</>
						) : (
							"Configure permissions for the selected role"
						)}
					</DialogDescription>
				</DialogHeader>

				{error && (
					<Alert variant="destructive" className="flex-shrink-0">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<div className="flex items-center space-x-2 py-2 flex-shrink-0">
					<div className="relative flex-1">
						<IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search permissions..."
							value={searchTerm}
							onChange={(e) => handleSearchChange(e.target.value)}
							className="pl-8"
						/>
					</div>
					{searchTerm && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => handleSearchChange("")}
						>
							<IconX className="h-4 w-4" />
						</Button>
					)}
				</div>

				<div className="flex-1 min-h-0 overflow-hidden">
					<ScrollArea className="h-full pr-4">
						<div className="space-y-4">
							{isLoading ? (
								<div className="space-y-4">
									{Array.from({ length: 3 }).map(() => (
										<div key={crypto.randomUUID()} className="space-y-2">
											<Skeleton className="h-6 w-1/3" />
											{Array.from({ length: 5 }).map(() => (
												<div
													key={crypto.randomUUID()}
													className="flex items-center space-x-2"
												>
													<Skeleton className="h-4 w-4" />
													<Skeleton className="h-4 w-1/2" />
												</div>
											))}
										</div>
									))}
								</div>
							) : Object.keys(groupedPermissions).length > 0 ? (
								Object.entries(groupedPermissions).map(
									([groupName, permissions]) => (
										<PermissionGroup
											key={groupName}
											groupName={groupName}
											permissions={permissions}
											onPermissionChange={handlePermissionChange}
											onGroupChange={handleGroupPermissionChange}
										/>
									),
								)
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

				<DialogFooter className="flex-shrink-0">
					<Button variant="outline" onClick={handleClose} disabled={isSaving}>
						Cancel
					</Button>
					<Button
						onClick={handleSavePermissions}
						disabled={isLoading || isSaving}
						data-testid="btn-save-permissions"
					>
						{isSaving ? "Saving..." : "Save Changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
