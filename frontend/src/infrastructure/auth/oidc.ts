import {
	authorizationCodeGrant,
	buildAuthorizationUrl,
	buildEndSessionUrl,
	type Configuration,
	calculatePKCECodeChallenge,
	discovery,
	fetchUserInfo,
	randomPKCECodeVerifier,
	randomState,
	refreshTokenGrant,
	type TokenEndpointResponse,
	type TokenEndpointResponseHelpers,
	tokenRevocation,
} from "openid-client";
import { OIDC_CONSTANTS } from "../constants";

let oidcConfig: Configuration | null = null;

/**
 * Validate OIDC configuration constants
 */
function validateOIDCConfig(): void {
	const requiredConfig = [
		{ key: "ISSUER", value: OIDC_CONSTANTS.ISSUER },
		{ key: "CLIENT_ID", value: OIDC_CONSTANTS.CLIENT_ID },
	];

	const placeholderValues = ["your-oidc-provider.com", "your-client-id"];

	for (const config of requiredConfig) {
		if (
			!config.value ||
			placeholderValues.some((placeholder) =>
				config.value.includes(placeholder),
			)
		) {
			throw new Error(
				`OIDC configuration not properly set. Please configure VITE_OIDC_${config.key} in your environment variables.`,
			);
		}
	}

	// For public clients, client_secret is optional
	if (OIDC_CONSTANTS.CLIENT_SECRET?.includes("your-client-secret")) {
		console.warn(
			"VITE_OIDC_CLIENT_SECRET contains placeholder value. For public clients, this can be omitted.",
		);
	}
}

/**
 * Get OpenID Connect configuration
 */
export async function getOIDCConfig(): Promise<Configuration> {
	if (oidcConfig) {
		return oidcConfig;
	}

	// Validate configuration before attempting discovery
	validateOIDCConfig();

	try {
		// For public clients, don't pass client_secret
		const discoveryOptions =
			OIDC_CONSTANTS.CLIENT_SECRET &&
			!OIDC_CONSTANTS.CLIENT_SECRET.includes("your-client-secret")
				? { client_secret: OIDC_CONSTANTS.CLIENT_SECRET }
				: {};

		oidcConfig = await discovery(
			new URL(OIDC_CONSTANTS.ISSUER),
			OIDC_CONSTANTS.CLIENT_ID,
			discoveryOptions,
		);
		return oidcConfig;
	} catch (error) {
		console.error("Failed to discover OIDC configuration:", error);
		throw new Error("OIDC configuration discovery failed");
	}
}

/**
 * Generate authorization URL for login
 */
export async function getAuthUrl(): Promise<{
	url: URL;
	state: string;
	codeVerifier: string;
}> {
	const config = await getOIDCConfig();
	const codeVerifier = randomPKCECodeVerifier();
	const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);
	const state = randomState();

	const url = buildAuthorizationUrl(config, {
		redirect_uri: OIDC_CONSTANTS.REDIRECT_URI,
		scope: OIDC_CONSTANTS.SCOPES,
		state,
		code_challenge: codeChallenge,
		code_challenge_method: "S256",
		response_type: OIDC_CONSTANTS.RESPONSE_TYPE,
	});

	return { url, state, codeVerifier };
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(
	callbackUrl: URL,
	codeVerifier: string,
	state: string,
): Promise<TokenEndpointResponse & TokenEndpointResponseHelpers> {
	try {
		const config = await getOIDCConfig();

		console.log("Attempting token exchange with:", {
			issuer: OIDC_CONSTANTS.ISSUER,
			clientId: OIDC_CONSTANTS.CLIENT_ID,
			redirectUri: OIDC_CONSTANTS.REDIRECT_URI,
			callbackUrl: callbackUrl.toString(),
			codeVerifier: `${codeVerifier.substring(0, 10)}...`, // Log partial verifier for debugging
			state: `${state.substring(0, 10)}...`, // Log partial state for debugging
		});

		const tokenSet = await authorizationCodeGrant(config, callbackUrl, {
			pkceCodeVerifier: codeVerifier,
			expectedState: state,
		});

		console.log("Token exchange successful");
		return tokenSet;
	} catch (error) {
		console.error("Token exchange failed:", error);

		// Provide more specific error messages based on error type
		if (error instanceof Error) {
			if (error.message.includes("invalid_client")) {
				throw new Error(
					"Invalid client credentials. Please check your OIDC client ID and secret.",
				);
			}
			if (error.message.includes("invalid_grant")) {
				throw new Error(
					"Invalid authorization code or PKCE verifier. The code may have expired or been used already.",
				);
			}
			if (error.message.includes("redirect_uri_mismatch")) {
				throw new Error(
					"Redirect URI mismatch. Please check your OIDC redirect URI configuration.",
				);
			}
			if (
				error.message.includes("network") ||
				error.message.includes("fetch")
			) {
				throw new Error(
					"Network error connecting to OIDC provider. Please check your internet connection and OIDC issuer URL.",
				);
			}
		}

		throw new Error(
			`Failed to exchange authorization code for tokens: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

/**
 * Refresh access token
 */
export async function refreshToken(
	refreshToken: string,
): Promise<TokenEndpointResponse & TokenEndpointResponseHelpers> {
	const config = await getOIDCConfig();

	try {
		const tokenSet = await refreshTokenGrant(config, refreshToken);
		return tokenSet;
	} catch (error) {
		console.error("Token refresh failed:", error);
		throw new Error("Failed to refresh access token");
	}
}

/**
 * Get user info from access token
 */
export async function getUserInfo(
	accessToken: string,
	expectedSubject: string,
): Promise<Record<string, unknown>> {
	const config = await getOIDCConfig();

	try {
		const userinfo = await fetchUserInfo(config, accessToken, expectedSubject);
		return userinfo;
	} catch (error) {
		console.error("Failed to get user info:", error);
		throw new Error("Failed to retrieve user information");
	}
}

/**
 * Revoke token
 */
export async function revokeToken(
	token: string,
	tokenTypeHint?: string,
): Promise<void> {
	const config = await getOIDCConfig();

	try {
		await tokenRevocation(
			config,
			token,
			tokenTypeHint
				? {
						token_type_hint: tokenTypeHint,
					}
				: {},
		);
	} catch (error) {
		console.error("Token revocation failed:", error);
		throw new Error("Failed to revoke token");
	}
}

/**
 * Build end session URL for RP-initiated logout
 */
export async function getEndSessionUrl(
	idTokenHint: string,
	postLogoutRedirectUri?: string,
	state?: string,
): Promise<URL> {
	const config = await getOIDCConfig();

	const params: Record<string, string> = {
		id_token_hint: idTokenHint,
	};

	if (postLogoutRedirectUri) {
		params.post_logout_redirect_uri = postLogoutRedirectUri;
	}

	if (state) {
		params.state = state;
	}

	const url = buildEndSessionUrl(config, params);

	return url;
}
