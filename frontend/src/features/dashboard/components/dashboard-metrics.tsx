import {
	IconUsers,
	IconShield,
	IconBuilding,
	IconUserCheck,
} from "@tabler/icons-react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { DASHBOARD_CONSTANTS } from "../constants";

interface DashboardMetricsProps {
	totalUsers: number;
	activeUsers: number;
	totalRoles: number;
	totalTenants: number;
}

export function DashboardMetrics({
	totalUsers,
	activeUsers,
	totalRoles,
	totalTenants,
}: DashboardMetricsProps) {
	const activeUsersPercentage =
		totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
			<Card
				className="bg-card border-border hover:border-accent transition-colors"
				data-testid="metric-total-users"
			>
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg text-foreground">
							{DASHBOARD_CONSTANTS.METRICS.USERS.TITLE}
						</CardTitle>
						<IconUsers className="w-5 h-5 text-cyan-400" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-cyan-400 mb-2">
						{totalUsers}
					</div>
					<div className="flex items-center text-sm text-muted-foreground">
						<span>{DASHBOARD_CONSTANTS.METRICS.USERS.DESCRIPTION}</span>
					</div>
				</CardContent>
			</Card>

			<Card
				className="bg-card border-border hover:border-accent transition-colors"
				data-testid="metric-active-users"
			>
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg text-foreground">
							Active Users
						</CardTitle>
						<IconUserCheck className="w-5 h-5 text-green-400" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-green-400 mb-2">
						{activeUsers}
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Active rate</span>
						<span className="text-green-400 font-medium">
							{activeUsersPercentage.toFixed(1)}%
						</span>
					</div>
					<Progress
						value={activeUsersPercentage}
						className="mt-2 h-2 bg-muted"
					/>
				</CardContent>
			</Card>

			<Card
				className="bg-card border-border hover:border-accent transition-colors"
				data-testid="metric-total-roles"
			>
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg text-foreground">
							{DASHBOARD_CONSTANTS.METRICS.ROLES.TITLE}
						</CardTitle>
						<IconShield className="w-5 h-5 text-yellow-400" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-yellow-400 mb-2">
						{totalRoles}
					</div>
					<div className="flex items-center text-sm text-muted-foreground">
						<span>{DASHBOARD_CONSTANTS.METRICS.ROLES.DESCRIPTION}</span>
					</div>
				</CardContent>
			</Card>

			<Card
				className="bg-card border-border hover:border-accent transition-colors"
				data-testid="metric-total-tenants"
			>
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg text-foreground">
							{DASHBOARD_CONSTANTS.METRICS.TENANTS.TITLE}
						</CardTitle>
						<IconBuilding className="w-5 h-5 text-purple-400" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-purple-400 mb-2">
						{totalTenants}
					</div>
					<div className="flex items-center text-sm text-muted-foreground">
						<span>{DASHBOARD_CONSTANTS.METRICS.TENANTS.DESCRIPTION}</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
