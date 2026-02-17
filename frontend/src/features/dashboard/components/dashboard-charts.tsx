import { IconChartBar, IconChartPie } from "@tabler/icons-react";
import { useId } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import type { ChartConfig } from "@/shared/components/ui/chart";
import { ChartContainer } from "@/shared/components/ui/chart";

interface ChartData {
	name: string;
	value: number;
	color: string;
}

interface RoleChartData {
	name: string;
	count: number;
}

interface DashboardChartsProps {
	usersChartData: ChartData[];
	rolesChartData: RoleChartData[];
}

export function DashboardCharts({
	usersChartData,
	rolesChartData,
}: DashboardChartsProps) {
	const gradientId = useId();

	const chartConfig: ChartConfig = {
		value: {
			label: "Value",
		},
	} satisfies ChartConfig;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 w-full">
			{/* Status Distribution Pie Chart */}
			<Card
				className="bg-card border-border hover:border-accent transition-colors w-full min-w-0"
				data-testid="status-chart"
			>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-foreground flex items-center gap-2">
								<IconChartPie className="w-5 h-5 text-blue-400" />
								Users Distribution
							</CardTitle>
							<CardDescription className="text-muted-foreground">
								Overview of active vs locked users
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<ChartContainer
						config={chartConfig}
						className="h-[250px] sm:h-[300px]"
					>
						<PieChart>
							<Pie
								data={usersChartData}
								cx="50%"
								cy="50%"
								outerRadius={100}
								dataKey="value"
								label={({ name, percent }) =>
									`${name}: ${(percent * 100).toFixed(0)}%`
								}
								labelLine={false}
							>
								{usersChartData.map((entry, _index) => (
									<Cell
										key={`cell-${entry.name}`}
										fill={entry.color}
										stroke="var(--card)"
										strokeWidth={2}
									/>
								))}
							</Pie>
							<Tooltip
								contentStyle={{
									backgroundColor: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: "8px",
									color: "var(--foreground)",
								}}
								labelStyle={{ color: "var(--foreground)" }}
							/>
						</PieChart>
					</ChartContainer>
					{/* Legend */}
					<div className="flex justify-center gap-6 mt-4">
						{usersChartData.map((entry) => (
							<div key={entry.name} className="flex items-center gap-2">
								<div
									className="w-3 h-3 rounded-full"
									style={{ backgroundColor: entry.color }}
								/>
								<span className="text-sm text-muted-foreground">
									{entry.name}
								</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Type Distribution Bar Chart */}
			<Card
				className="bg-card border-border hover:border-accent transition-colors w-full min-w-0"
				data-testid="type-chart"
			>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-foreground flex items-center gap-2">
								<IconChartBar className="w-5 h-5 text-cyan-400" />
								Roles Distribution
							</CardTitle>
							<CardDescription className="text-muted-foreground">
								Distribution of roles in the system
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="overflow-x-auto">
					<ChartContainer
						config={chartConfig}
						className="h-[280px] sm:h-[320px] min-w-[300px]"
					>
						<BarChart
							data={rolesChartData}
							margin={{
								top: 20,
								right: 10,
								left: 0,
								bottom: rolesChartData.length > 3 ? 80 : 60,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
							<XAxis
								dataKey="name"
								stroke="var(--muted-foreground)"
								fontSize={11}
								angle={rolesChartData.length > 3 ? -45 : 0}
								textAnchor={rolesChartData.length > 3 ? "end" : "middle"}
								height={rolesChartData.length > 3 ? 80 : 40}
								interval={0}
								tick={{ fill: "var(--muted-foreground)" }}
								tickFormatter={(value) => {
									const maxLength = 10;
									return value.length > maxLength
										? `${value.substring(0, maxLength)}...`
										: value;
								}}
							/>
							<YAxis
								stroke="var(--muted-foreground)"
								width={40}
								tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: "8px",
									color: "var(--foreground)",
									padding: "8px 12px",
								}}
								labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
								formatter={(value, _name) => [value, "Count"]}
							/>
							<Bar
								dataKey="count"
								fill={`url(#${gradientId})`}
								radius={[4, 4, 0, 0]}
								stroke="var(--chart-2)"
								strokeWidth={1}
							/>
							<defs>
								<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
									<stop
										offset="5%"
										stopColor="var(--chart-2)"
										stopOpacity={0.8}
									/>
									<stop
										offset="95%"
										stopColor="var(--chart-2)"
										stopOpacity={0.3}
									/>
								</linearGradient>
							</defs>
						</BarChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	);
}
