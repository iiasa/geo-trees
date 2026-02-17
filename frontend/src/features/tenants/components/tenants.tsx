import { PageHeader } from "@/shared/components/page-header";
import { PageLayout } from "@/shared/components/page-layout";
import { TENANT_PAGE_CONSTANTS } from "../constants";
import { TenantsList } from "@/features/tenants/components/tenants-list";

export function TenantsPage() {
	return (
		<PageLayout>
			<PageHeader
				title={TENANT_PAGE_CONSTANTS.TITLE}
				description={TENANT_PAGE_CONSTANTS.DESCRIPTION}
			/>
			<TenantsList />
		</PageLayout>
	);
}
