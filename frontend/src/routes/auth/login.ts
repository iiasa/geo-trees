import { createFileRoute } from "@tanstack/react-router";
import { getAuthUrl } from "@/infrastructure/auth/oidc";
import { updateSession } from "@/infrastructure/auth/session";
import { OIDC_CONSTANTS } from "@/infrastructure/constants";

interface LoginResponse {
	authUrl: string;
}

const json = (data: LoginResponse) => Response.json(data);

export const Route = createFileRoute("/auth/login")({
	server: {
		handlers: {
			GET: async () => {
				try {
					const { url, state, codeVerifier } = await getAuthUrl();

					// Store state and codeVerifier in session for callback verification
					await updateSession(
						{
							password: OIDC_CONSTANTS.SESSION_SECRET,
						},
						{
							oidcState: state,
							codeVerifier,
						},
					);

					return json({
						authUrl: url.toString(),
					});
				} catch (error) {
					console.error("Login URL generation failed:", error);
					return new Response("Failed to generate login URL", { status: 500 });
				}
			},
		},
	},
});
