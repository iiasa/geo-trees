import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Loader2 } from "lucide-react";
import { useTenantFormStore } from "../stores/tenant-form-store";
import type { TenantDto } from "@/infrastructure/api/types.gen";

// Form validation schema
const tenantFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	adminEmailAddress: z.string().refine(
		(val) => {
			if (!val || val === "") return true;
			return z.email().safeParse(val).success;
		},
		{ message: "Invalid email address" },
	),
	adminPassword: z.string().refine(
		(val) => {
			if (!val || val === "") return true;
			return val.length >= 6;
		},
		{ message: "Password must be at least 6 characters" },
	),
});

export type TenantFormData = z.infer<typeof tenantFormSchema>;

interface TenantFormProps {
	tenant?: TenantDto;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: TenantFormData) => Promise<void>;
	isLoading: boolean;
	mode: "create" | "edit";
}

export function TenantForm({
	tenant,
	open,
	onOpenChange,
	onSubmit,
	isLoading,
	mode,
}: TenantFormProps) {
	const { formData, resetForm } = useTenantFormStore();

	const form = useForm<TenantFormData>({
		resolver: zodResolver(tenantFormSchema),
		defaultValues: {
			name: tenant?.name || "",
			adminEmailAddress: "",
			adminPassword: "",
		},
	});

	// Update form when tenant changes (edit mode) or when dialog opens with tenant
	useEffect(() => {
		if (open && tenant && mode === "edit") {
			form.reset({
				name: tenant.name || "",
				adminEmailAddress: "",
				adminPassword: "",
			});
		}
	}, [tenant, mode, form, open]);

	// Update form when formData changes (create mode)
	useEffect(() => {
		if (mode === "create") {
			form.reset(formData);
		}
	}, [formData, form, mode]);

	const handleSubmit = async (data: TenantFormData) => {
		// Filter out empty optional fields in edit mode
		const submitData =
			mode === "edit"
				? ({ name: data.name } as TenantFormData)
				: {
						name: data.name,
						adminEmailAddress: data.adminEmailAddress || "",
						adminPassword: data.adminPassword || "",
					};

		await onSubmit(submitData);
		onOpenChange(false);
		resetForm();
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			resetForm();
		}
		onOpenChange(newOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{mode === "create" ? "Create New Tenant" : "Edit Tenant"}
					</DialogTitle>
					<DialogDescription>
						{mode === "create"
							? "Create a new tenant with an admin account."
							: "Update the tenant information."}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Tenant name"
											data-testid="field-name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{mode === "create" && (
							<>
								<FormField
									control={form.control}
									name="adminEmailAddress"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Admin Email</FormLabel>
											<FormControl>
												<Input
													placeholder="admin@example.com"
													type="email"
													data-testid="field-adminEmailAddress"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="adminPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Admin Password</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter password"
													type="password"
													data-testid="field-adminPassword"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => handleOpenChange(false)}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isLoading}
								data-testid="btn-submit"
							>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{mode === "create" ? "Create" : "Update"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
