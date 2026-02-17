import { createFileRoute } from "@tanstack/react-router";
import { RolesPage } from "@/features/roles/components/roles";

export const Route = createFileRoute("/_authed/admin/roles")({
	component: RolesPage,
});
