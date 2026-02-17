import { createFileRoute } from "@tanstack/react-router";
import { CommentsPage } from "@/features/cms/comments/components/comments";

export const Route = createFileRoute("/admin/cms/comments")({
	component: CommentsPage,
});
