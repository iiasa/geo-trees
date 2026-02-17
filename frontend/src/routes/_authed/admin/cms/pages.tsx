import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/admin/cms/pages")({
	component: PagesLayout,
});

function PagesLayout() {
	return <Outlet />;
}
