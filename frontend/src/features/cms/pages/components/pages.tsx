import { PageHeader } from "@/shared/components/page-header";
import { PageLayout } from "@/shared/components/page-layout";
import { PAGE_PAGE_CONSTANTS } from "../constants";
import { PagesList } from "./pages-list";

export function PagesPage() {
	return (
		<PageLayout>
			<PageHeader
				title={PAGE_PAGE_CONSTANTS.TITLE}
				description={PAGE_PAGE_CONSTANTS.DESCRIPTION}
			/>
			<PagesList />
		</PageLayout>
	);
}
