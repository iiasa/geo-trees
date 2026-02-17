import { PageHeader } from "@/shared/components/page-header";
import { PageLayout } from "@/shared/components/page-layout";
import { USER_PAGE_CONSTANTS } from "../constants";
import { UsersList } from "@/features/users/components/users-list";

export function UsersPage() {
	return (
		<PageLayout>
			<PageHeader
				title={USER_PAGE_CONSTANTS.TITLE}
				description={USER_PAGE_CONSTANTS.DESCRIPTION}
			/>
			<UsersList />
		</PageLayout>
	);
}
