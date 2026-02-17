import { createFileRoute } from "@tanstack/react-router";
import { clearSession, getSession } from "@tanstack/react-start/server";
import { createSession } from "@/infrastructure/auth/auth-server";
import { exchangeCodeForTokens } from "@/infrastructure/auth/oidc";
import type { SessionData } from "@/infrastructure/auth/session";
import { OIDC_CONSTANTS } from "@/infrastructure/constants";

type OIDCSessionData = SessionData & {
	oidcState?: string;
	codeVerifier?: string;
};

export const Route = createFileRoute("/auth/callback")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const url = new URL(request.url);
				const code = url.searchParams.get("code");
				const state = url.searchParams.get("state");
				const error = url.searchParams.get("error");

				if (error) {
					console.error("OIDC callback error:", error);
					return new Response(null, {
						status: 302,
						headers: { Location: "/?error=auth_failed" },
					});
				}

				if (!code || !state) {
					console.error("Missing code or state parameter");
					return new Response(null, {
						status: 302,
						headers: { Location: "/?error=missing_params" },
					});
				}

				try {
					// Retrieve stored state and codeVerifier from session
					const session = await getSession({
						password: OIDC_CONSTANTS.SESSION_SECRET,
					});

					const sessionData = session?.data as OIDCSessionData;

					if (
						!session ||
						!sessionData?.oidcState ||
						!sessionData?.codeVerifier
					) {
						console.error("Missing session data");
						return new Response(null, {
							status: 302,
							headers: { Location: "/?error=invalid_session" },
						});
					}

					if (sessionData.oidcState !== state) {
						console.error("State mismatch");
						return new Response(null, {
							status: 302,
							headers: { Location: "/?error=state_mismatch" },
						});
					}

					const tokenSet = await exchangeCodeForTokens(
						url,
						sessionData.codeVerifier,
						state,
					);

					// Create user session
					await createSession(tokenSet);

					// Clear the temporary OIDC session data
					await clearSession({
						password: OIDC_CONSTANTS.SESSION_SECRET,
					});

					// Redirect to dashboard or home page
					return new Response(null, {
						status: 302,
						headers: { Location: "/dashboard" },
					});
				} catch (error) {
					console.error("Callback processing failed:", error);

					// Determine appropriate error redirect based on error type
					let errorParam = "auth_failed";
					if (error instanceof Error) {
						if (error.message.includes("OIDC configuration not properly set")) {
							errorParam = "config_error";
						} else if (error.message.includes("Invalid client credentials")) {
							errorParam = "invalid_client";
						} else if (error.message.includes("Invalid authorization code")) {
							errorParam = "invalid_code";
						} else if (error.message.includes("Network error")) {
							errorParam = "network_error";
						}
					}

					return new Response(null, {
						status: 302,
						headers: { Location: `/?error=${errorParam}` },
					});
				}
			},
		},
	},
});
