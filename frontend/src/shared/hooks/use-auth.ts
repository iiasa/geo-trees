import { useQuery } from "@tanstack/react-query";

export function useAuth() {
	const { data: appConfig, isLoading } = useQuery({
		queryKey: ["auth", "me"],
		queryFn: async ({ signal }) => {
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
		staleTime: 5 * 60 * 1000,
	});

	const user = appConfig?.user ?? null;

	return {
		user,
		isAuthenticated: !!user,
		isLoading,
		login: async () => {
			window.location.href = "/auth/login";
		},
		logout: async () => {
			window.location.href = "/auth/logout";
		},
		refresh: async () => {
			window.location.reload();
		},
		clearError: () => {},
		authState: {
			isAuthenticated: !!user,
			isLoading,
			user,
		},
	};
}
