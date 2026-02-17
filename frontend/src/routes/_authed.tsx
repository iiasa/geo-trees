import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getUserSession } from "@/infrastructure/auth/session";

const getAuthUser = createServerFn({ method: "GET" }).handler(async () => {
	const session = await getUserSession();
	return session?.user ?? null;
});

export const Route = createFileRoute("/_authed")({
	beforeLoad: async () => {
		const user = await getAuthUser();
		if (!user) {
			throw redirect({ to: "/" });
		}
		return { user };
	},
	component: () => <Outlet />,
});
