import { createFileRoute } from "@tanstack/react-router";
import { TenantsPage } from "@/features/tenants/components/tenants";

export const Route = createFileRoute("/_authed/admin/tenants")({
	component: TenantsPage,
});
