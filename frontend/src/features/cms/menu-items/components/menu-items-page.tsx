import { PageHeader } from "@/shared/components/page-header";
import { PageLayout } from "@/shared/components/page-layout";
import { MENU_ITEMS_PAGE_COPY } from "../constants";
import { MenuItemsList } from "./menu-items-list";

export function MenuItemsPage() {
	return (
		<PageLayout>
			<PageHeader
				title={MENU_ITEMS_PAGE_COPY.TITLE}
				description={MENU_ITEMS_PAGE_COPY.DESCRIPTION}
			/>
			<MenuItemsList />
		</PageLayout>
	);
}
