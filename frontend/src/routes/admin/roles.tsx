import { createFileRoute } from "@tanstack/react-router";
import { RolesPage } from "@/features/roles/components/roles";

export const Route = createFileRoute("/admin/roles")({
	component: RolesPage,
});
