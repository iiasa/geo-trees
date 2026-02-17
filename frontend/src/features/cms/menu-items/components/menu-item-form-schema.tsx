import { z } from "zod";
import { MENU_ITEM_VALIDATION } from "../constants";

export const menuItemSchema = z.object({
	displayName: z.string().min(1, MENU_ITEM_VALIDATION.DISPLAY_REQUIRED),
	url: z.string().optional(),
	icon: z.string().optional(),
	target: z.string().optional(),
	elementId: z.string().optional(),
	cssClass: z.string().optional(),
	pageId: z.string().optional(),
	requiredPermissionName: z.string().optional(),
	isActive: z.boolean().default(true),
	parentId: z.string().nullable().optional(),
	order: z.number().int().min(0).optional(),
});

export type MenuItemFormValues = z.infer<typeof menuItemSchema>;

export const cleanOptionalString = (value?: string | null) => {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
};
