import { createFileRoute } from "@tanstack/react-router";
import { UsersPage } from "@/features/users/components/users";

export const Route = createFileRoute("/_authed/admin/users")({
	component: UsersPage,
});
