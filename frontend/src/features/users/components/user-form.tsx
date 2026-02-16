import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import type { IdentityUserDto } from "@/infrastructure/api/types.gen";
import { useUserFormStore } from "../stores/user-form-store";
import { Button } from "@/shared/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Switch } from "@/shared/components/ui/switch";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Badge } from "@/shared/components/ui/badge";
import { userGetAssignableRolesOptions } from "@/infrastructure/api/@tanstack/react-query.gen";
import { userGetRoles } from "@/infrastructure/api/sdk.gen";

const userFormSchema = z.object({
	userName: z.string().min(1, "Username is required"),
	name: z.string().optional(),
	surname: z.string().optional(),
	email: z.email(),
	phoneNumber: z.string().optional(),
	isActive: z.boolean(),
	lockoutEnabled: z.boolean(),
	password: z.string().optional(),
	confirmPassword: z.string().optional(),
	roles: z.array(z.string()).optional(),
});

export type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormProps {
	user?: IdentityUserDto | null;
	onSubmit: (data: UserFormData) => Promise<void>;
	isLoading?: boolean;
	mode: "create" | "edit";
}

export function UserForm({
	user,
	onSubmit,
	isLoading = false,
	mode,
}: UserFormProps) {
	const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
	const { open, closeForm } = useUserFormStore();

	// Fetch available roles
	const { data: assignableRolesData, isLoading: rolesLoading } = useQuery(
		userGetAssignableRolesOptions({}),
	);

	// Fetch current user roles when editing
	const { data: userRolesData } = useQuery({
		queryKey: ["userRoles", user?.id],
		queryFn: async () => {
			if (!user?.id) return { items: [] };
			const { data } = await userGetRoles({
				path: { id: user.id },
			});
			return data;
		},
		enabled: !!user?.id && mode === "edit",
	});

	const assignableRoles = assignableRolesData?.items || [];
	const userRoles = userRolesData?.items;

	// Memoize role names to create stable dependency
	const userRoleNames = useMemo(() => {
		if (mode === "edit" && userRoles && userRoles.length > 0) {
			return userRoles.map((role) => role.name || "").filter(Boolean);
		}
		return [];
	}, [userRoles, mode]);

	// Update selected roles when user roles data changes
	useEffect(() => {
		if (mode === "edit" && userRoleNames.length > 0) {
			setSelectedRoles(userRoleNames);
		} else if (mode === "create") {
			setSelectedRoles([]);
		}
	}, [userRoleNames, mode]);

	const form = useForm<UserFormData>({
		resolver: zodResolver(
			mode === "create"
				? userFormSchema.refine(
						(data) => data.password === data.confirmPassword,
						{
							message: "Passwords don't match",
							path: ["confirmPassword"],
						},
					)
				: userFormSchema,
		),
		defaultValues: {
			userName: user?.userName || "",
			name: user?.name || "",
			surname: user?.surname || "",
			email: user?.email || "",
			phoneNumber: user?.phoneNumber || "",
			isActive: user?.isActive !== undefined ? user.isActive : true,
			lockoutEnabled:
				user?.lockoutEnabled !== undefined ? user.lockoutEnabled : true,
			password: "",
			confirmPassword: "",
			roles:
				mode === "edit" && userRoles && userRoles.length > 0
					? userRoles.map((role) => role.name || "").filter(Boolean)
					: [],
		},
	});

	// Reset form when dialog opens or user/mode changes
	useEffect(() => {
		if (open) {
			form.reset({
				userName: user?.userName || "",
				name: user?.name || "",
				surname: user?.surname || "",
				email: user?.email || "",
				phoneNumber: user?.phoneNumber || "",
				isActive: user?.isActive !== undefined ? user.isActive : true,
				lockoutEnabled:
					user?.lockoutEnabled !== undefined ? user.lockoutEnabled : true,
				password: "",
				confirmPassword: "",
				roles: [],
			});
		}
	}, [
		open,
		form,
		user?.userName,
		user?.name,
		user?.surname,
		user?.email,
		user?.phoneNumber,
		user?.isActive,
		user?.lockoutEnabled,
	]);

	// Update form values when selected roles change (after user roles are loaded)
	useEffect(() => {
		if (mode === "edit" && selectedRoles.length > 0) {
			form.setValue("roles", selectedRoles);
		}
	}, [selectedRoles, mode, form]);

	const handleRoleChange = (roleName: string, checked: boolean) => {
		if (checked) {
			setSelectedRoles((prev) => [...prev, roleName]);
		} else {
			setSelectedRoles((prev) => prev.filter((name) => name !== roleName));
		}
	};

	const handleSubmit = async (data: UserFormData) => {
		try {
			// Include selected roles in the form data
			const formDataWithRoles = {
				...data,
				roles: selectedRoles,
			};
			await onSubmit(formDataWithRoles);
			form.reset();
			setSelectedRoles([]);
		} catch (_error) {
			toast.error("Failed to save user");
		}
	};

	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			closeForm();
			form.reset();
			setSelectedRoles([]);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent
				className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto"
				data-testid="user-form-modal"
			>
				<DialogHeader>
					<DialogTitle>
						{mode === "create" ? "Create User" : "Edit User"}
					</DialogTitle>
					<DialogDescription>
						{mode === "create"
							? "Add a new user to the system."
							: "Update user information."}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
						suppressHydrationWarning
					>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="userName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username *</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter username"
												data-testid="field-username"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email *</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="Enter email"
												data-testid="field-email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter first name"
												data-testid="field-name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="surname"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter last name"
												data-testid="field-surname"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="phoneNumber"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone Number</FormLabel>
									<FormControl>
										<Input placeholder="Enter phone number" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{mode === "create" && (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password *</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="Enter password"
													data-testid="field-password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Confirm Password *</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="Confirm password"
													data-testid="field-confirmPassword"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						)}

						<div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:space-x-4">
							<FormField
								control={form.control}
								name="isActive"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 w-full sm:w-auto">
										<div className="space-y-0.5">
											<FormLabel>Active</FormLabel>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lockoutEnabled"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 w-full sm:w-auto">
										<div className="space-y-0.5">
											<FormLabel>Lockout Enabled</FormLabel>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						{/* Roles Selection */}
						{mode === "edit" && (
							<FormItem>
								<FormLabel>Roles</FormLabel>
								<div className="space-y-2 mt-2">
									{rolesLoading ? (
										<div className="text-sm text-muted-foreground">
											Loading roles...
										</div>
									) : assignableRoles.length > 0 ? (
										assignableRoles.map((role) => (
											<div
												key={role.id}
												className="flex items-center space-x-2"
											>
												<Checkbox
													id={`role-${role.id}`}
													checked={selectedRoles.includes(role.name || "")}
													onCheckedChange={(checked) =>
														handleRoleChange(
															role.name || "",
															checked as boolean,
														)
													}
												/>
												<label
													htmlFor={`role-${role.id}`}
													className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
												>
													{role.name}
												</label>
												{role.isDefault && (
													<Badge variant="secondary" className="text-xs">
														Default
													</Badge>
												)}
											</div>
										))
									) : (
										<div className="text-sm text-muted-foreground">
											No roles available
										</div>
									)}
								</div>
								<FormMessage />
							</FormItem>
						)}

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => closeForm()}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isLoading}
								data-testid="btn-save-user"
							>
								{isLoading
									? "Saving..."
									: mode === "create"
										? "Create"
										: "Update"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
