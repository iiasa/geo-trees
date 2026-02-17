import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRoute,
	HeadContent,
	Scripts,
	useLocation,
} from "@tanstack/react-router";
import { AuthProvider } from "@/features/auth/hooks/use-auth";
import { PagesLayout } from "@/shared/components/pages-layout";
import { SidebarLayout } from "@/shared/components/sidebar-layout";
import { Toaster } from "@/shared/components/ui/sonner";

// Configure API client to use proxy
// import "@/lib/api-config";

import appCss from "../styles.css?url";

// Create a client with optimized CMS cache configuration
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Cache CMS content for 5 minutes before considering it stale
			staleTime: 5 * 60 * 1000,
			// Keep unused data in cache for 30 minutes
			gcTime: 30 * 60 * 1000,
			// Don't refetch on window focus for CMS content (users expect stable content)
			refetchOnWindowFocus: false,
			// Retry failed requests up to 3 times with exponential backoff
			retry: 3,
			// Limit to 1 retry for mutations to avoid duplicate submissions
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		},
		mutations: {
			// Only retry mutations once to avoid duplicate operations
			retry: 1,
		},
	},
});

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Geo Trees",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
	notFoundComponent: () => (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				<h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
				<p className="text-lg text-muted-foreground mb-8">Page not found</p>
				<a
					href="/"
					className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
				>
					Go Home
				</a>
			</div>
		</div>
	),
});

function ConditionalLayout({ children }: { children: React.ReactNode }) {
	const location = useLocation();

	// Routes that should use the sidebar layout
	const sidebarRoutes = [
		"/dashboard",
		"/demo",
		"/admin",
		"/settings",
		"/profile",
	];

	const isPagesRoute =
		location.pathname === "/page" || location.pathname.startsWith("/page/");
	const shouldUseSidebar = sidebarRoutes.some((route) =>
		location.pathname.startsWith(route),
	);

	if (isPagesRoute) {
		return <PagesLayout>{children}</PagesLayout>;
	}

	if (shouldUseSidebar) {
		return <SidebarLayout>{children}</SidebarLayout>;
	}

	return <>{children}</>;
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<html lang="en" className="light">
					<head>
						<HeadContent />
					</head>
					<body className="min-h-screen bg-background text-foreground">
						<ConditionalLayout>{children}</ConditionalLayout>
						<Toaster />
						<Scripts />
					</body>
				</html>
			</AuthProvider>
		</QueryClientProvider>
	);
}
