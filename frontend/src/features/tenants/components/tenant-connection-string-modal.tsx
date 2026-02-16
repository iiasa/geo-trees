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
import { Loader2, Database } from "lucide-react";
import { useTenantConnectionStore } from "../stores/tenant-connection-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	getApiMultiTenancyTenantsByIdDefaultConnectionStringOptions,
	putApiMultiTenancyTenantsByIdDefaultConnectionStringMutation,
	deleteApiMultiTenancyTenantsByIdDefaultConnectionStringMutation,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import { toast } from "sonner";

// Form validation schema
const connectionStringFormSchema = z.object({
	connectionString: z.string().min(1, "Connection string is required"),
});

export type ConnectionStringFormData = z.infer<
	typeof connectionStringFormSchema
>;

export function TenantConnectionStringModal() {
	const {
		open,
		tenant,
		connectionString,
		isLoading: loading,
		closeModal,
		setLoading,
		setConnectionString,
	} = useTenantConnectionStore();

	const form = useForm<ConnectionStringFormData>({
		resolver: zodResolver(connectionStringFormSchema),
		defaultValues: {
			connectionString: "",
		},
	});

	// Query to get the current connection string
	const { data: currentConnectionString, isLoading } = useQuery({
		...getApiMultiTenancyTenantsByIdDefaultConnectionStringOptions({
			path: { id: tenant?.id || "" },
		}),
		enabled: !!tenant?.id && open,
		select: (data) => {
			// Handle null or undefined data (204 No Content)
			if (data === null || data === undefined) {
				return "";
			}

			// If it's already a string, return it
			if (typeof data === "string") {
				return data;
			}

			// If it's an object, try to convert to string
			if (typeof data === "object") {
				try {
					const stringResult = String(data);
					// Check if it's "[object ReadableStream]" issue
					if (stringResult === "[object ReadableStream]") {
						console.warn(
							"Received ReadableStream instead of string for connection string",
						);
						return "";
					}
					return stringResult;
				} catch (e) {
					console.error("Error converting connection string to string:", e);
					return "";
				}
			}

			// For any other type, try to convert to string
			return String(data);
		},
	});

	// Update form when connection string changes
	useEffect(() => {
		if (currentConnectionString !== undefined) {
			setConnectionString(currentConnectionString);
			form.setValue("connectionString", currentConnectionString);
		}
	}, [currentConnectionString, setConnectionString, form]);

	// Set loading state based on query
	useEffect(() => {
		setLoading(isLoading);
	}, [isLoading, setLoading]);

	// Reset form when dialog closes
	useEffect(() => {
		if (!open) {
			form.reset();
		}
	}, [open, form]);

	// Mutation to update connection string
	const updateConnectionStringMutation = useMutation({
		...putApiMultiTenancyTenantsByIdDefaultConnectionStringMutation(),
		onSuccess: () => {
			toast.success("Connection string updated successfully");
			closeModal();
		},
	});

	// Mutation to delete connection string
	const deleteConnectionStringMutation = useMutation({
		...deleteApiMultiTenancyTenantsByIdDefaultConnectionStringMutation(),
		onSuccess: () => {
			toast.success("Connection string deleted successfully");
			closeModal();
		},
	});

	const handleSubmit = async (data: ConnectionStringFormData) => {
		if (!tenant?.id) return;

		try {
			setLoading(true);
			await updateConnectionStringMutation.mutateAsync({
				path: { id: tenant.id },
				query: { defaultConnectionString: data.connectionString },
			});
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to update connection string";
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteConnectionString = async () => {
		if (!tenant?.id) return;

		if (confirm("Are you sure you want to delete the connection string?")) {
			try {
				setLoading(true);
				await deleteConnectionStringMutation.mutateAsync({
					path: { id: tenant.id },
				});
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error
						? error.message
						: "Failed to delete connection string";
				toast.error(errorMessage);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<Dialog open={open} onOpenChange={closeModal}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Database className="h-5 w-5" />
						Manage Connection String
					</DialogTitle>
					<DialogDescription>
						Configure the database connection string for tenant:{" "}
						<span className="font-semibold">{tenant?.name}</span>
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="connectionString"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Connection String</FormLabel>
									<FormControl>
										<Input
											placeholder="Server=myServerAddress;Database=myDataBase;User Id=myUsername;Password=myPassword;"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter className="flex justify-between">
							<Button
								type="button"
								variant="destructive"
								onClick={handleDeleteConnectionString}
								disabled={loading || !connectionString}
							>
								{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Delete
							</Button>
							<div className="flex gap-2">
								<Button
									type="button"
									variant="outline"
									onClick={closeModal}
									disabled={loading}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={loading}>
									{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									Save
								</Button>
							</div>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
