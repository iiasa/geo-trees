import { PageHeader } from "@/shared/components/page-header";
import { PageLayout } from "@/shared/components/page-layout";
import { COMMENT_PAGE_CONSTANTS } from "../constants";
import { CommentsModeration } from "./comments-moderation";

export function CommentsPage() {
	return (
		<PageLayout>
			<PageHeader
				title={COMMENT_PAGE_CONSTANTS.TITLE}
				description={COMMENT_PAGE_CONSTANTS.DESCRIPTION}
			/>
			<CommentsModeration />
		</PageLayout>
	);
}
