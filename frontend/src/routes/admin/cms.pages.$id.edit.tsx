import { createFileRoute } from "@tanstack/react-router";
import { EditPage } from "@/features/cms/pages/components/edit-page";

export const Route = createFileRoute("/admin/cms/pages/$id/edit")({
	component: EditPage,
});
