import { createFileRoute, redirect } from "@tanstack/react-router";
import { performLogout } from "@/infrastructure/auth/auth-server";

export const Route = createFileRoute("/auth/logout")({
	server: {
		handlers: {
			GET: async () => {
				try {
					// Perform complete logout including token revocation and session clearing
					const { endSessionUrl } = await performLogout();

					// If we have an end session URL, redirect to it for RP-initiated logout
					if (endSessionUrl) {
						return new Response(null, {
							status: 302,
							headers: { Location: endSessionUrl },
						});
					}

					// Fallback: redirect to home page if no end session URL
					return redirect({
						to: "/",
						throw: false,
					});
				} catch (error) {
					console.error("Logout failed:", error);
					return redirect({
						to: "/",
						throw: false,
					});
				}
			},
		},
	},
});
