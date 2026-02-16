import { PageHeader } from "@/shared/components/page-header";
import { PageLayout } from "@/shared/components/page-layout";
import { ROLE_PAGE_CONSTANTS } from "../constants";
import { RolesList } from "@/features/roles/components/roles-list";

export function RolesPage() {
	return (
		<PageLayout>
			<PageHeader
				title={ROLE_PAGE_CONSTANTS.TITLE}
				description={ROLE_PAGE_CONSTANTS.DESCRIPTION}
			/>
			<RolesList />
		</PageLayout>
	);
}
