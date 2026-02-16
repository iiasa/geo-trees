import type {
	TokenEndpointResponse,
	TokenEndpointResponseHelpers,
} from "openid-client";
import { OIDC_CONSTANTS, TOKEN_REFRESH_THRESHOLD } from "../constants";
import {
	getEndSessionUrl,
	getUserInfo,
	refreshToken,
	revokeToken,
} from "./oidc";
import { type SessionData, sessionUtils, type User } from "./session";

// Refresh lock to prevent concurrent refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<SessionData | null> | null = null;

/**
 * Get session from request
 */
export async function getUserSession(): Promise<SessionData | null> {
	try {
		const sessionData = await sessionUtils.get();

		if (!sessionData) {
			return null;
		}

		// Get expiration from JWT token if available, fallback to stored expiresAt
		const tokenExpiration = getTokenExpiration(sessionData.accessToken);
		const expirationTime = tokenExpiration ?? sessionData.expiresAt;

		// Check if token needs refresh (proactive: 15 minutes before expiration)
		const now = Date.now();
		const needsRefresh = now >= expirationTime - TOKEN_REFRESH_THRESHOLD;

		if (needsRefresh) {
			if (!sessionData.refreshToken) {
				// No refresh token available, clear session
				await sessionUtils.clear();
				return null;
			}

			// Check if refresh is already in progress
			if (isRefreshing && refreshPromise) {
				// Wait for ongoing refresh to complete
				return refreshPromise;
			}

			// Start refresh with lock
			isRefreshing = true;
			refreshPromise = (async () => {
				try {
					if (!sessionData.refreshToken) {
						throw new Error("No refresh token available");
					}
					const newTokens = await refreshToken(sessionData.refreshToken);
					const accessToken = newTokens.access_token;
					if (!accessToken) {
						throw new Error("No access token in refresh response");
					}

					// Extract expiration from new token if available
					const newTokenExpiration = getTokenExpiration(accessToken);
					const newExpiresAt = newTokenExpiration
						? newTokenExpiration
						: Date.now() + (newTokens.expiresIn?.() || 3600) * 1000;

					// Update session data
					sessionData.accessToken = accessToken;
					// Preserve refresh token if provider doesn't return a new one
					sessionData.refreshToken =
						newTokens.refresh_token || sessionData.refreshToken;
					sessionData.idToken = newTokens.id_token || sessionData.idToken;
					sessionData.expiresAt = newExpiresAt;

					await sessionUtils.update(sessionData);
					return sessionData;
				} catch (error) {
					console.error("Token refresh failed:", error);
					// Token refresh failed, clear session
					await sessionUtils.clear();
					return null;
				} finally {
					// Release lock
					isRefreshing = false;
					refreshPromise = null;
				}
			})();

			return refreshPromise;
		}

		return sessionData;
	} catch (error) {
		console.error("Session retrieval failed:", error);
		return null;
	}
}

/**
 * Create/update session with user data
 */
export async function createSession(
	tokenResponse: TokenEndpointResponse & TokenEndpointResponseHelpers,
): Promise<SessionData> {
	try {
		// Get user info from token claims instead of user info endpoint
		const accessToken = tokenResponse.access_token;
		if (!accessToken) {
			throw new Error("No access token in response");
		}

		// Extract user claims from the ID token
		const claims = tokenResponse.claims();
		if (!claims) {
			throw new Error("No claims found in token response");
		}

		const { sub } = claims;
		if (!sub) {
			throw new Error("No subject (sub) claim found in token");
		}

		// Use claims as user info, with fallback to getUserInfo if needed
		let userInfo: Record<string, unknown> = claims;

		// Try to get additional user info from user info endpoint if available
		try {
			const additionalUserInfo = await getUserInfo(accessToken, sub as string);
			// Merge claims with additional user info, giving priority to claims for core fields
			userInfo = { ...additionalUserInfo, ...claims };
		} catch (userInfoError) {
			console.warn(
				"Could not fetch additional user info, using token claims only:",
				userInfoError,
			);
			// Continue with claims only
		}

		const accessTokenPayload = decodeJwtPayload(accessToken);
		const roles = mergeRoles(
			extractRoles(userInfo),
			extractRoles(accessTokenPayload ?? {}),
		);

		// Extract expiration from JWT token if available, otherwise use expiresIn
		const tokenExpiration = getTokenExpiration(accessToken);
		const expiresAt = tokenExpiration
			? tokenExpiration
			: Date.now() + (tokenResponse.expiresIn?.() || 3600) * 1000;

		const sessionData: SessionData = {
			user: {
				...(userInfo as unknown as User),
				roles,
			},
			accessToken,
			refreshToken: tokenResponse.refresh_token,
			idToken: tokenResponse.id_token,
			expiresAt,
		};

		await sessionUtils.update(sessionData);
		return sessionData;
	} catch (error) {
		console.error("Session creation failed:", error);
		throw new Error("Failed to create user session");
	}
}

function extractRoles(userInfo: Record<string, unknown>): string[] {
	const roles = new Set<string>();

	const addRole = (value: unknown) => {
		if (typeof value === "string") {
			roles.add(value.toLowerCase());
		} else if (Array.isArray(value)) {
			value.forEach((v) => {
				if (typeof v === "string") {
					roles.add(v.toLowerCase());
				}
			});
		}
	};

	addRole(userInfo.roles);
	addRole(userInfo.role);
	addRole((userInfo as Record<string, unknown>)["cognito:groups"]);

	const realmAccess = (userInfo as Record<string, unknown>).realm_access;
	if (realmAccess && typeof realmAccess === "object") {
		addRole((realmAccess as { roles?: unknown }).roles);
	}

	const resourceAccess = (userInfo as Record<string, unknown>).resource_access;
	if (resourceAccess && typeof resourceAccess === "object") {
		Object.values(resourceAccess as Record<string, unknown>).forEach(
			(entry) => {
				if (entry && typeof entry === "object") {
					addRole((entry as { roles?: unknown }).roles);
				}
			},
		);
	}

	return Array.from(roles);
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
	try {
		const parts = token.split(".");
		if (parts.length < 2) {
			return null;
		}
		const payload = parts[1]
			.replace(/-/g, "+")
			.replace(/_/g, "/")
			.padEnd(Math.ceil(parts[1].length / 4) * 4, "=");
		const json = Buffer.from(payload, "base64").toString("utf-8");
		return JSON.parse(json) as Record<string, unknown>;
	} catch (error) {
		console.warn("Failed to decode access token payload:", error);
		return null;
	}
}

/**
 * Get token expiration from JWT access token
 * Extracts the `exp` claim (expiration in seconds since epoch) and converts to milliseconds
 * @param accessToken - JWT access token string
 * @returns Expiration timestamp in milliseconds, or null if token is invalid or missing exp claim
 */
function getTokenExpiration(accessToken: string): number | null {
	const payload = decodeJwtPayload(accessToken);
	if (!payload) {
		return null;
	}

	const exp = payload.exp;
	if (typeof exp !== "number") {
		return null;
	}

	// Convert from seconds to milliseconds
	return exp * 1000;
}

function mergeRoles(...roleLists: string[][]): string[] {
	const combined = new Set<string>();
	for (const list of roleLists) {
		if (!list) {
			continue;
		}
		for (const role of list) {
			combined.add(role.toLowerCase());
		}
	}
	return Array.from(combined);
}

/**
 * Perform complete logout including token revocation and end session URL
 */
export async function performLogout(): Promise<{ endSessionUrl?: string }> {
	try {
		const session = await getUserSession();

		let endSessionUrl: string | undefined;

		if (session) {
			// Revoke tokens if they exist
			try {
				if (session.accessToken) {
					await revokeToken(session.accessToken, "access_token");
				}
				if (session.refreshToken) {
					await revokeToken(session.refreshToken, "refresh_token");
				}
			} catch (revokeError) {
				console.warn(
					"Token revocation failed, continuing with logout:",
					revokeError,
				);
				// Continue with logout even if token revocation fails
			}

			// Build end session URL for RP-initiated logout
			try {
				const endSessionURL = await getEndSessionUrl(
					session.idToken || "", // idTokenHint - use stored ID token for proper end session
					OIDC_CONSTANTS.BASE_URL, // postLogoutRedirectUri - absolute URI to home page after logout
				);
				endSessionUrl = endSessionURL.toString();
			} catch (urlError) {
				console.warn(
					"Failed to build end session URL, proceeding without it:",
					urlError,
				);
			}
		}

		// Clear the local session
		await sessionUtils.clear();

		return { endSessionUrl };
	} catch (error) {
		console.error("Logout failed:", error);
		throw new Error("Failed to perform logout");
	}
}
