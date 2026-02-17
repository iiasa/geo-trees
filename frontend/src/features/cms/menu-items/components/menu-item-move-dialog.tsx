import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import {
	MENU_ITEM_BUTTONS,
	MENU_ITEM_MESSAGES,
	MENU_ITEM_MOVE_COPY,
} from "../constants";
import type { MenuItemDto } from "@/infrastructure/api/types.gen";
import { buildParentOptions, getSiblingCount } from "../utils";
import type { MenuItemNode } from "../utils";

const moveSchema = z.object({
	newParentId: z.string().nullable(),
	position: z.number().int().min(0),
});

type MoveFormValues = z.infer<typeof moveSchema>;

interface MenuItemMoveDialogProps {
	open: boolean;
	item: MenuItemDto | null;
	tree: MenuItemNode[];
	allItems: MenuItemDto[];
	isSubmitting: boolean;
	onClose: () => void;
	onMove: (values: MoveFormValues) => Promise<void>;
}

export function MenuItemMoveDialog({
	open,
	item,
	tree,
	allItems,
	isSubmitting,
	onClose,
	onMove,
}: MenuItemMoveDialogProps) {
	const siblingCount = useMemo(
		() => getSiblingCount(allItems, item?.parentId ?? null, item?.id ?? null),
		[allItems, item?.id, item?.parentId],
	);

	const formValues = useMemo(
		() => ({
			newParentId: item?.parentId ?? null,
			position: item?.order ?? siblingCount,
		}),
		[item?.order, item?.parentId, siblingCount],
	);

	const form = useForm<MoveFormValues>({
		resolver: zodResolver(moveSchema),
		values: formValues,
	});

	const parentOptions = useMemo(
		() => buildParentOptions(tree, item?.id),
		[item?.id, tree],
	);

	const onSubmit = async (values: MoveFormValues) => {
		await onMove(values);
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{MENU_ITEM_MOVE_COPY.TITLE}</DialogTitle>
					<DialogDescription>
						{MENU_ITEM_MOVE_COPY.DESCRIPTION}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="newParentId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{MENU_ITEM_MOVE_COPY.PARENT_LABEL}</FormLabel>
									<FormControl>
										<Select
											value={field.value ?? ""}
											onValueChange={(value) => {
												const selectedParent = value || null;
												field.onChange(selectedParent);
												const nextSiblingCount = getSiblingCount(
													allItems,
													selectedParent,
													item?.id ?? null,
												);
												const currentPosition = form.getValues("position") ?? 0;
												if (currentPosition > nextSiblingCount) {
													form.setValue("position", nextSiblingCount);
												}
											}}
											disabled={isSubmitting}
										>
											<SelectTrigger>
												<SelectValue
													placeholder={MENU_ITEM_MOVE_COPY.PARENT_LABEL}
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
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="position"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{MENU_ITEM_MOVE_COPY.POSITION_LABEL}</FormLabel>
									<FormControl>
										<Input
											type="number"
											value={field.value}
											min={0}
											onChange={(event) =>
												field.onChange(Number(event.target.value))
											}
											disabled={isSubmitting}
										/>
									</FormControl>
									<p className="text-xs text-muted-foreground">
										{MENU_ITEM_MOVE_COPY.POSITION_HELP}
									</p>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter className="gap-2">
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
									: MENU_ITEM_BUTTONS.APPLY}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
