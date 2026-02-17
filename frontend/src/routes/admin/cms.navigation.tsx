import { createFileRoute } from "@tanstack/react-router";
import { MenuItemsPage } from "@/features/cms/menu-items/components/menu-items-page";

export const Route = createFileRoute("/admin/cms/navigation")({
	component: MenuItemsPage,
});
