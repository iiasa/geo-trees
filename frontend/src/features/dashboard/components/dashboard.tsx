import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
	roleGetListOptions,
	tenantGetListOptions,
	userGetListOptions,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PageHeader } from "@/shared/components/page-header";
import { PageLayout } from "@/shared/components/page-layout";
import { ProtectedRoute } from "../../auth/components/protected-route";
import { useAuth } from "../../auth/hooks/use-auth";
import { DASHBOARD_CONSTANTS } from "../constants";
import { DashboardActivity } from "./dashboard-activity";
import { DashboardCharts } from "./dashboard-charts";
import { DashboardMetrics } from "./dashboard-metrics";

export default function Dashboard() {
	const { authState } = useAuth();
	const { user } = authState;

	// Fetch users data
	const {
		data: usersResponse,
		isLoading: isLoadingUsers,
		error: usersError,
	} = useQuery(
		userGetListOptions({
			query: {
				MaxResultCount: 1000,
				SkipCount: 0,
			},
		}),
	);

	// Fetch roles data
	const {
		data: rolesResponse,
		isLoading: isLoadingRoles,
		error: rolesError,
	} = useQuery(
		roleGetListOptions({
			query: {
				MaxResultCount: 1000,
				SkipCount: 0,
			},
		}),
	);

	// Fetch tenants data
	const {
		data: tenantsResponse,
		isLoading: isLoadingTenants,
		error: tenantsError,
	} = useQuery(
		tenantGetListOptions({
			query: {
				MaxResultCount: 1000,
				SkipCount: 0,
			},
		}),
	);

	const isLoading = isLoadingUsers || isLoadingRoles || isLoadingTenants;
	const hasError = usersError || rolesError || tenantsError;

	// Calculate metrics
	const metrics = useMemo(() => {
		const totalUsers = usersResponse?.totalCount || 0;
		const totalRoles = rolesResponse?.totalCount || 0;
		const totalTenants = tenantsResponse?.totalCount || 0;

		// Calculate active users (users that are not locked out)
		const activeUsers =
			usersResponse?.items?.filter((u) => !u.lockoutEnabled || !u.lockoutEnd)
				.length || 0;

		return {
			totalUsers,
			activeUsers,
			totalRoles,
			totalTenants,
		};
	}, [usersResponse, rolesResponse, tenantsResponse]);

	// Prepare data for charts
	const usersChartData = useMemo(() => {
		if (!usersResponse?.items) return [];

		const activeCount =
			usersResponse.items.filter((u) => !u.lockoutEnabled || !u.lockoutEnd)
				.length || 0;
		const lockedCount = usersResponse.items.length - activeCount;

		return [
			{
				name: "Active",
				value: activeCount,
				color: "var(--chart-1)",
			},
			{
				name: "Locked",
				value: lockedCount,
				color: "var(--destructive)",
			},
		];
	}, [usersResponse]);

	const rolesChartData = useMemo(() => {
		if (!rolesResponse?.items) return [];

		const roleCount: Record<string, number> = {};
		rolesResponse.items.forEach((role) => {
			const roleName = role.name || "Unknown";
			roleCount[roleName] = (roleCount[roleName] || 0) + 1;
		});

		return Object.entries(roleCount).map(([name, count]) => ({
			name,
			count,
		}));
	}, [rolesResponse]);

	// Prepare recent activity from users
	const recentActivity = useMemo(() => {
		if (!usersResponse?.items) return [];

		return usersResponse.items
			.sort((a, b) => {
				const aTime = a.lastModificationTime || a.creationTime || "";
				const bTime = b.lastModificationTime || b.creationTime || "";
				return new Date(bTime).getTime() - new Date(aTime).getTime();
			})
			.slice(0, 5)
			.map((userItem, index) => {
				const date =
					userItem.lastModificationTime ||
					userItem.creationTime ||
					new Date().toISOString();
				const formattedDate = new Date(date).toLocaleDateString();
				return {
					id: index,
					user: userItem.userName || "Unknown",
					action: userItem.lastModificationTime
						? "Updated user"
						: "Created user",
					target: userItem.userName || "Unknown",
					time: formattedDate,
					avatar: (userItem.userName || "U").substring(0, 2).toUpperCase(),
				};
			});
	}, [usersResponse]);

	// Prepare team members from users
	const teamMembers = useMemo(() => {
		if (!usersResponse?.items) return [];

		return usersResponse.items.slice(0, 5).map((userItem, index) => ({
			id: index,
			name: userItem.userName || "Unknown",
			avatar: (userItem.userName || "U").substring(0, 2).toUpperCase(),
			role: "User",
			status: (index % 3 === 0
				? "online"
				: index % 3 === 1
					? "away"
					: "offline") as "online" | "away" | "offline",
			tasksCompleted: 0,
		}));
	}, [usersResponse]);

	if (hasError) {
		return (
			<ProtectedRoute>
				<Card className="bg-card border-border">
					<CardHeader>
						<CardTitle className="text-foreground">Error</CardTitle>
						<CardDescription className="text-muted-foreground">
							Failed to load dashboard data
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-destructive">
							{usersError?.error?.message ||
								rolesError?.error?.message ||
								tenantsError?.error?.message ||
								"Unknown error occurred"}
						</p>
					</CardContent>
				</Card>
			</ProtectedRoute>
		);
	}

	return (
		<ProtectedRoute>
			<PageLayout>
				<div className="text-foreground" data-testid="dashboard-content">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
						<PageHeader
							title={DASHBOARD_CONSTANTS.TITLE}
							description={DASHBOARD_CONSTANTS.DESCRIPTION}
						/>
						<div className="flex items-center gap-4">
							<div className="text-xs sm:text-sm text-muted-foreground">
								Welcome, {user?.name || user?.preferred_username || "User"}
							</div>
						</div>
					</div>

					{/* Loading State */}
					{isLoading && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
							{["users", "roles", "tenants"].map((key) => (
								<Card key={key} className="bg-card border-border">
									<CardHeader>
										<Skeleton className="h-4 w-24" />
									</CardHeader>
									<CardContent>
										<Skeleton className="h-8 w-16 mb-2" />
										<Skeleton className="h-4 w-32" />
									</CardContent>
								</Card>
							))}
						</div>
					)}

					{/* Metrics Cards */}
					{!isLoading && (
						<DashboardMetrics
							totalUsers={metrics.totalUsers}
							activeUsers={metrics.activeUsers}
							totalRoles={metrics.totalRoles}
							totalTenants={metrics.totalTenants}
						/>
					)}

					{/* Charts */}
					{!isLoading && (
						<DashboardCharts
							usersChartData={usersChartData}
							rolesChartData={rolesChartData}
						/>
					)}

					{/* Activity and Team Members */}
					{!isLoading && (
						<DashboardActivity
							recentActivity={recentActivity}
							teamMembers={teamMembers}
						/>
					)}
				</div>
			</PageLayout>
		</ProtectedRoute>
	);
}
