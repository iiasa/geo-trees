import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import {
	getApiCmsKitAdminMenuItemsLookupPagesOptions,
	getApiCmsKitAdminMenuItemsLookupPermissionsOptions,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import type { MenuItemDto } from "@/infrastructure/api/types.gen";
import { Button } from "@/shared/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import {
	MENU_ITEM_BUTTONS,
	MENU_ITEM_FORM_HELPERS,
	MENU_ITEM_FORM_LABELS,
	MENU_ITEM_FORM_PLACEHOLDERS,
	MENU_ITEM_MESSAGES,
	MENU_ITEMS_PAGE_COPY,
} from "../constants";
import {
	cleanOptionalString,
	menuItemSchema,
	type MenuItemFormValues,
} from "./menu-item-form-schema";

interface MenuItemFormProps {
	open: boolean;
	mode: "create" | "edit";
	initialValues: MenuItemDto | null;
	parentOptions: { id: string | null; label: string; depth: number }[];
	defaultOrder: number;
	defaultParentId: string | null;
	onClose: () => void;
	onSubmit: (values: MenuItemFormValues) => Promise<void>;
	isSubmitting: boolean;
}

export function MenuItemForm({
	open,
	mode,
	initialValues,
	parentOptions,
	defaultOrder,
	defaultParentId,
	onClose,
	onSubmit,
	isSubmitting,
}: MenuItemFormProps) {
	const [pageSearch, setPageSearch] = useState("");
	const [permissionSearch, setPermissionSearch] = useState("");
	const formValues = useMemo(
		() => ({
			displayName: initialValues?.displayName ?? "",
			url: initialValues?.url ?? "",
			icon: initialValues?.icon ?? "",
			target: initialValues?.target ?? "",
			elementId: initialValues?.elementId ?? "",
			cssClass: initialValues?.cssClass ?? "",
			pageId: initialValues?.pageId ?? "",
			requiredPermissionName: initialValues?.requiredPermissionName ?? "",
			isActive: initialValues?.isActive ?? true,
			parentId:
				mode === "create" ? defaultParentId : (initialValues?.parentId ?? null),
			order:
				mode === "create"
					? defaultOrder
					: (initialValues?.order ?? defaultOrder),
		}),
		[defaultOrder, defaultParentId, initialValues, mode],
	);
	const resolver = zodResolver(menuItemSchema) as Resolver<MenuItemFormValues>;
	const form = useForm<MenuItemFormValues>({
		resolver,
		defaultValues: formValues,
	});
	useEffect(() => {
		form.reset(formValues);
	}, [formValues, form]);
	const pageLookupQuery = useQuery({
		...getApiCmsKitAdminMenuItemsLookupPagesOptions({
			query: {
				Filter: pageSearch || undefined,
				MaxResultCount: 50,
			},
		}),
		enabled: open,
	});

	const permissionLookupQuery = useQuery({
		...getApiCmsKitAdminMenuItemsLookupPermissionsOptions({
			query: {
				Filter: permissionSearch || undefined,
			},
		}),
		enabled: open,
	});
	const handleSubmitForm: SubmitHandler<MenuItemFormValues> = async (
		values,
	) => {
		const payload: MenuItemFormValues = {
			displayName: values.displayName.trim(),
			url: cleanOptionalString(values.url),
			icon: cleanOptionalString(values.icon),
			target: cleanOptionalString(values.target),
			elementId: cleanOptionalString(values.elementId),
			cssClass: cleanOptionalString(values.cssClass),
			pageId: cleanOptionalString(values.pageId),
			requiredPermissionName: cleanOptionalString(
				values.requiredPermissionName,
			),
			isActive: values.isActive,
			parentId: mode === "create" ? (values.parentId ?? null) : undefined,
			order: mode === "create" ? (values.order ?? 0) : undefined,
		};
		await onSubmit(payload);
	};

	const pageOptions = pageLookupQuery.data?.items ?? [];
	const permissionOptions = permissionLookupQuery.data?.items ?? [];

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>
						{mode === "create"
							? MENU_ITEM_BUTTONS.ADD_ROOT
							: MENU_ITEM_BUTTONS.EDIT}
					</DialogTitle>
					<DialogDescription>
						{MENU_ITEMS_PAGE_COPY.DESCRIPTION}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						className="space-y-4"
						onSubmit={form.handleSubmit(handleSubmitForm)}
					>
						<FormField
							control={form.control}
							name="displayName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{MENU_ITEM_FORM_LABELS.DISPLAY_NAME}</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={MENU_ITEM_FORM_PLACEHOLDERS.DISPLAY_NAME}
											disabled={isSubmitting}
											data-testid="menu-item-display"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="url"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{MENU_ITEM_FORM_LABELS.URL}</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder={MENU_ITEM_FORM_PLACEHOLDERS.URL}
												disabled={isSubmitting}
												data-testid="menu-item-url"
											/>
										</FormControl>
										<p className="text-xs text-muted-foreground">
											{MENU_ITEM_FORM_HELPERS.URL}
										</p>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="icon"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{MENU_ITEM_FORM_LABELS.ICON}</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder={MENU_ITEM_FORM_PLACEHOLDERS.ICON}
												disabled={isSubmitting}
												data-testid="menu-item-icon"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="target"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{MENU_ITEM_FORM_LABELS.TARGET}</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder={MENU_ITEM_FORM_PLACEHOLDERS.TARGET}
												disabled={isSubmitting}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="elementId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{MENU_ITEM_FORM_LABELS.ELEMENT_ID}</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder={MENU_ITEM_FORM_PLACEHOLDERS.ELEMENT_ID}
												disabled={isSubmitting}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="cssClass"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{MENU_ITEM_FORM_LABELS.CSS_CLASS}</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder={MENU_ITEM_FORM_PLACEHOLDERS.CSS_CLASS}
												disabled={isSubmitting}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="isActive"
								render={({ field }) => (
									<FormItem className="flex items-center justify-between space-y-0 rounded-lg border px-3 py-2">
										<FormLabel>{MENU_ITEM_FORM_LABELS.IS_ACTIVE}</FormLabel>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
												disabled={isSubmitting}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="pageId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{MENU_ITEM_FORM_LABELS.PAGE}</FormLabel>
										<FormControl>
											<div className="space-y-2">
												<Input
													value={pageSearch}
													onChange={(event) =>
														setPageSearch(event.target.value)
													}
													placeholder={MENU_ITEM_FORM_PLACEHOLDERS.PAGE}
													disabled={isSubmitting}
												/>
												<Select
													value={field.value ?? ""}
													onValueChange={(value) => {
														field.onChange(value);
														const selected = pageOptions.find(
															(page) => page.id === value,
														);
														if (selected?.slug) {
															form.setValue("url", `/page/${selected.slug}`);
														}
													}}
													disabled={isSubmitting}
												>
													<SelectTrigger>
														<SelectValue
															placeholder={MENU_ITEM_FORM_PLACEHOLDERS.PAGE}
														/>
													</SelectTrigger>
													<SelectContent>
														{pageOptions.map((page) => (
															<SelectItem key={page.id} value={page.id ?? ""}>
																{page.title || page.slug || page.id}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<p className="text-xs text-muted-foreground">
													{MENU_ITEM_FORM_HELPERS.PAGE}
												</p>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="requiredPermissionName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{MENU_ITEM_FORM_LABELS.PERMISSION}</FormLabel>
										<FormControl>
											<div className="space-y-2">
												<Input
													value={permissionSearch}
													onChange={(event) =>
														setPermissionSearch(event.target.value)
													}
													placeholder={MENU_ITEM_FORM_PLACEHOLDERS.PERMISSION}
													disabled={isSubmitting}
												/>
												<Select
													value={field.value ?? ""}
													onValueChange={field.onChange}
													disabled={isSubmitting}
												>
													<SelectTrigger>
														<SelectValue
															placeholder={
																MENU_ITEM_FORM_PLACEHOLDERS.PERMISSION
															}
														/>
													</SelectTrigger>
													<SelectContent>
														{permissionOptions.map((permission) => (
															<SelectItem
																key={permission.name}
																value={permission.name ?? ""}
															>
																{permission.displayName || permission.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<p className="text-xs text-muted-foreground">
													{MENU_ITEM_FORM_HELPERS.PERMISSION}
												</p>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{mode === "create" ? (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="parentId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{MENU_ITEM_FORM_LABELS.PARENT}</FormLabel>
											<FormControl>
												<Select
													value={field.value ?? ""}
													onValueChange={(value) =>
														field.onChange(value || null)
													}
													disabled={isSubmitting}
												>
													<SelectTrigger>
														<SelectValue
															placeholder={MENU_ITEM_FORM_PLACEHOLDERS.PARENT}
														/>
													</SelectTrigger>
													<SelectContent>
														{parentOptions.map((option) => (
															<SelectItem
																key={option.id ?? "root"}
																value={option.id ?? ""}
															>
																<span
																	className="inline-block"
																	style={{ paddingLeft: option.depth * 8 }}
																>
																	{option.label}
																</span>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<p className="text-xs text-muted-foreground">
												{MENU_ITEM_FORM_HELPERS.PARENT}
											</p>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="order"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{MENU_ITEM_FORM_LABELS.ORDER}</FormLabel>
											<FormControl>
												<Input
													type="number"
													value={field.value ?? 0}
													onChange={(event) =>
														field.onChange(Number(event.target.value))
													}
													placeholder={MENU_ITEM_FORM_PLACEHOLDERS.ORDER}
													disabled={isSubmitting}
												/>
											</FormControl>
											<p className="text-xs text-muted-foreground">
												{MENU_ITEM_FORM_HELPERS.ORDER}
											</p>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						) : (
							<p className="text-sm text-muted-foreground">
								{MENU_ITEM_FORM_HELPERS.PARENT}
							</p>
						)}
						<div className="flex justify-end gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								disabled={isSubmitting}
							>
								{MENU_ITEM_BUTTONS.CLOSE}
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting
									? MENU_ITEM_MESSAGES.LOADING
									: MENU_ITEM_BUTTONS.SAVE}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
