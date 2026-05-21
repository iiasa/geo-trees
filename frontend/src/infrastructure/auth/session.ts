// utils/session.ts
import {
	clearSession,
	getSession,
	updateSession,
	useSession,
} from "@tanstack/react-start/server";
import { OIDC_CONSTANTS } from "../constants";

// Refuse to start the server with the placeholder session secret: anyone who
// has read the source can forge cookies, so leaving it in place silently turns
// every staging/QA deploy into an authentication bypass.
const PLACEHOLDER_SESSION_SECRET =
	"your-super-secret-key-change-this-in-production";
if (
	!OIDC_CONSTANTS.SESSION_SECRET ||
	OIDC_CONSTANTS.SESSION_SECRET === PLACEHOLDER_SESSION_SECRET ||
	OIDC_CONSTANTS.SESSION_SECRET.length < 32
) {
	throw new Error(
		"VITE_SESSION_SECRET is missing, too short (<32 chars), or matches the placeholder. " +
			"Set a high-entropy value before starting the server.",
	);
}

export interface User {
	sub: string;
	name?: string;
	email?: string;
	email_verified?: boolean;
	picture?: string;
	profile?: string;
	preferred_username?: string;
	given_name?: string;
	family_name?: string;
	updated_at?: number;
	roles?: string[];
}

export type SessionData = {
	user: User;
	accessToken: string;
	refreshToken?: string;
	idToken?: string;
	expiresAt: number;
};

const sessionOptions = {
	name: OIDC_CONSTANTS.SESSION_COOKIE_NAME,
	password: OIDC_CONSTANTS.SESSION_SECRET,
	cookie: {
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax" as const,
		httpOnly: true,
	},
};

export function useAppSession() {
	return useSession<SessionData>({
		...sessionOptions,
	});
}

/**
 * Server-side session management utilities
 */
export const sessionUtils = {
	/**
	 * Get the current session data
	 */
	async get(): Promise<SessionData | null> {
		try {
			const session = await getSession(sessionOptions);

			if (!session || !session.data) {
				return null;
			}

			return session.data as SessionData;
		} catch (error) {
			console.error("Session retrieval failed:", error);
			return null;
		}
	},

	/**
	 * Update the session with new data
	 */
	async update(sessionData: SessionData): Promise<void> {
		try {
			await updateSession(sessionOptions, sessionData);
		} catch (error) {
			console.error("Session update failed:", error);
			throw new Error("Failed to update session");
		}
	},

	/**
	 * Clear the current session
	 */
	async clear(): Promise<void> {
		try {
			await clearSession(sessionOptions);
		} catch (error) {
			console.error("Session clear failed:", error);
			throw new Error("Failed to clear session");
		}
	},
};

// Export individual functions for convenience
export const getUserSession = sessionUtils.get;

// Export updateSession for use in other modules
export { updateSession };
