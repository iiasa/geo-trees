import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { QUERY_KEYS } from "@/shared/constants";

// Types
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

export interface AuthState {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	error?: string;
}

// Context
const AuthContext = createContext<{
	login: () => Promise<void>;
	logout: () => Promise<void>;
	refresh: () => Promise<void>;
	clearError: () => void;
	authState: AuthState;
} | null>(null);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
	const [_authState, setAuthState] = useState<AuthState>({
		user: null,
		isLoading: true,
		isAuthenticated: false,
		error: undefined,
	});

	const queryClient = useQueryClient();

	// Check if we're in test mode
	const isTestMode =
		typeof window !== "undefined" &&
		(window.location.hostname === "localhost" ||
			window.location.hostname === "127.0.0.1") &&
		(localStorage.getItem("test-mode") === "true" ||
			sessionStorage.getItem("test-mode") === "true");

	// Query for user data via session endpoint
	const {
		data: userData,
		isLoading,
		error,
	} = useQuery({
		queryKey: QUERY_KEYS.AUTH_ME,
		queryFn: async ({ signal }) => {
			if (isTestMode) {
				return {
					user: {
						sub: "test-user-id",
						name: "Test User",
						email: "test@example.com",
						email_verified: true,
						picture: "",
						preferred_username: "testuser",
						given_name: "Test",
						family_name: "User",
						updated_at: Date.now(),
						roles: ["admin"],
					},
					expiresAt: Date.now() + 3600000, // 1 hour from now
				};
			}

			const response = await fetch("/auth/me", { signal });
			if (!response.ok) {
				if (response.status === 401 || response.status === 403) {
					return null;
				}
				throw new Error("Failed to fetch user data");
			}
			return response.json();
		},
		retry: false,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	const mappedUser = userData?.user || null;

	// Update auth state when user data changes
	useEffect(() => {
		setAuthState({
			user: mappedUser,
			isLoading,
			isAuthenticated: !!mappedUser,
			error: error instanceof Error ? error.message : undefined,
		});
	}, [mappedUser, isLoading, error]);

	// Login function
	const login = async () => {
		try {
			setAuthState((prev) => ({ ...prev, error: undefined }));
			const response = await fetch("/auth/login");

			if (!response.ok) {
				const errorText = await response.text();
				let errorMessage = "Failed to initiate login";

				if (
					response.status === 500 &&
					errorText.includes("OIDC configuration")
				) {
					errorMessage =
						"Authentication is not configured. Please check your OIDC provider settings.";
				} else if (response.status === 500) {
					errorMessage = "Server error during login. Please try again later.";
				}

				setAuthState((prev) => ({ ...prev, error: errorMessage }));
				return;
			}

			const { authUrl } = await response.json();

			// Redirect to OIDC provider
			window.location.href = authUrl;
		} catch (error) {
			console.error("Login failed:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "An unexpected error occurred during login";
			setAuthState((prev) => ({ ...prev, error: errorMessage }));
		}
	};

	// Logout function
	const logout = async () => {
		try {
			// Clear local state first
			setAuthState({
				user: null,
				isLoading: false,
				isAuthenticated: false,
			});
			queryClient.clear();

			// Navigate to logout endpoint - this will trigger server-side logout
			// and redirect to OIDC provider's end session endpoint
			// Using window.location.href ensures the browser follows the redirect properly
			window.location.href = "/auth/logout";
		} catch (error) {
			console.error("Logout failed:", error);
			// Fallback: redirect to home
			window.location.href = "/";
		}
	};

	// Refresh user data
	const refresh = async () => {
		await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
	};

	// Clear error function
	const clearError = () => {
		setAuthState((prev) => ({ ...prev, error: undefined }));
	};

	const value = {
		login,
		logout,
		refresh,
		clearError,
		authState: _authState,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

// Combined hook for auth state and functions
export function useAuthCombined(): AuthState & {
	login: () => Promise<void>;
	logout: () => Promise<void>;
	refresh: () => Promise<void>;
	clearError: () => void;
} {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuthCombined must be used within an AuthProvider");
	}

	const { login, logout, refresh, clearError, authState } = context;

	return {
		...authState,
		login,
		logout,
		refresh,
		clearError,
	};
}

// Hook to get auth state
export function useAuthState(): AuthState {
	const { data: userData, isLoading } = useQuery({
		queryKey: QUERY_KEYS.AUTH_ME,
		queryFn: async () => {
			const response = await fetch("/auth/me");
			if (!response.ok) {
				throw new Error("Failed to fetch user data");
			}
			return response.json();
		},
		retry: false,
		staleTime: 5 * 60 * 1000,
	});

	return {
		user: userData?.user || null,
		isLoading,
		isAuthenticated: !!userData?.user,
		error: undefined, // This hook doesn't manage errors, only the AuthProvider does
	};
}
