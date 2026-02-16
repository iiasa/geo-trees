import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageComments } from "@/features/cms/comments/components/page-comments";
import { ENTITY_TYPES } from "@/features/cms/comments/constants";
import { PuckRender } from "@/features/cms/pages/components/puck-render";
import { pagesPublicFindBySlugOptions } from "@/infrastructure/api/@tanstack/react-query.gen";
import { PageHeader } from "@/shared/components/page-header";
import { Spinner } from "@/shared/components/ui/spinner";

const PAGE_COPY = {
	FALLBACK_TITLE: "Untitled page",
	NOT_FOUND_TITLE: "Page not found",
	NOT_FOUND_DESCRIPTION:
		"The page you are looking for could not be found or is unavailable.",
	SLUG_PREFIX: "Slug: ",
};

export const Route = createFileRoute("/page/$slug")({
	ssr: false,
	component: PageComponent,
});

function PageComponent() {
	const { slug } = Route.useParams();
	const { data: page, isLoading } = useQuery(
		pagesPublicFindBySlugOptions({ query: { slug } }),
	);

	if (isLoading) {
		return (
			<div className="flex justify-center py-10">
				<Spinner className="size-10" />
			</div>
		);
	}

	if (!page) {
		return (
			<PageHeader
				title={PAGE_COPY.NOT_FOUND_TITLE}
				description={PAGE_COPY.NOT_FOUND_DESCRIPTION}
			/>
		);
	}

	const pageContent = page.content ?? "";

	return (
		<div className="space-y-6">
			<PuckRender content={pageContent} />
			{page.id && (
				<PageComments entityId={page.id} entityType={ENTITY_TYPES.PAGE} />
			)}
		</div>
	);
}
