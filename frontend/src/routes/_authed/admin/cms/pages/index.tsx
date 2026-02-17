import { createFileRoute } from "@tanstack/react-router";
import { PagesPage } from "@/features/cms/pages/components/pages";

export const Route = createFileRoute("/_authed/admin/cms/pages/")({
	component: PagesPage,
});
