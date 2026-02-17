import { createFileRoute } from "@tanstack/react-router";
import { CreatePage } from "@/features/cms/pages/components/create-page";

export const Route = createFileRoute("/_authed/admin/cms/pages/new")({
	component: CreatePage,
});
