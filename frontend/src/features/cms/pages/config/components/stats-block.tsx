import type { ComponentConfig } from "@measured/puck";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import {
	TrendingUp,
	TrendingDown,
	Users,
	DollarSign,
	Activity,
	ShoppingCart,
} from "lucide-react";
import { PUCK_COMPONENT_LABELS } from "../../constants";

export const StatsBlock: ComponentConfig = {
	label: PUCK_COMPONENT_LABELS.STATS,
	fields: {
		stats: {
			type: "array",
			label: "Statistics",
			arrayFields: {
				label: {
					type: "text",
					label: "Label",
				},
				value: {
					type: "text",
					label: "Value",
				},
				description: {
					type: "text",
					label: "Description",
				},
				icon: {
					type: "select",
					label: "Icon",
					options: [
						{ label: "None", value: "none" },
						{ label: "Users", value: "users" },
						{ label: "Dollar", value: "dollar" },
						{ label: "Activity", value: "activity" },
						{ label: "Shopping Cart", value: "cart" },
						{ label: "Trending Up", value: "trending-up" },
						{ label: "Trending Down", value: "trending-down" },
					],
				},
				color: {
					type: "select",
					label: "Color",
					options: [
						{ label: "Default", value: "default" },
						{ label: "Blue", value: "blue" },
						{ label: "Green", value: "green" },
						{ label: "Yellow", value: "yellow" },
						{ label: "Purple", value: "purple" },
						{ label: "Red", value: "red" },
					],
				},
			},
			defaultItemProps: {
				label: "Metric",
				value: "0",
				description: "Description",
				icon: "none",
				color: "default",
			},
		},
		columns: {
			type: "select",
			label: "Columns (Desktop)",
			options: [
				{ label: "1 Column", value: "1" },
				{ label: "2 Columns", value: "2" },
				{ label: "3 Columns", value: "3" },
				{ label: "4 Columns", value: "4" },
			],
		},
	},
	defaultProps: {
		stats: [
			{
				label: "Total Users",
				value: "2,543",
				description: "Active users this month",
				icon: "users",
				color: "blue",
			},
			{
				label: "Revenue",
				value: "$45,231",
				description: "+20% from last month",
				icon: "dollar",
				color: "green",
			},
			{
				label: "Activity",
				value: "12,234",
				description: "Events tracked",
				icon: "activity",
				color: "yellow",
			},
			{
				label: "Sales",
				value: "573",
				description: "Transactions completed",
				icon: "cart",
				color: "purple",
			},
		],
		columns: "4",
	},
	render: ({ stats, columns }) => {
		const getIcon = (iconName: string) => {
			switch (iconName) {
				case "users":
					return <Users className="w-5 h-5" />;
				case "dollar":
					return <DollarSign className="w-5 h-5" />;
				case "activity":
					return <Activity className="w-5 h-5" />;
				case "cart":
					return <ShoppingCart className="w-5 h-5" />;
				case "trending-up":
					return <TrendingUp className="w-5 h-5" />;
				case "trending-down":
					return <TrendingDown className="w-5 h-5" />;
				default:
					return null;
			}
		};

		const getColorClass = (color: string) => {
			switch (color) {
				case "blue":
					return "text-cyan-400";
				case "green":
					return "text-green-400";
				case "yellow":
					return "text-yellow-400";
				case "purple":
					return "text-purple-400";
				case "red":
					return "text-red-400";
				default:
					return "text-primary";
			}
		};

		const gridColsClass =
			columns === "1"
				? "lg:grid-cols-1"
				: columns === "2"
					? "lg:grid-cols-2"
					: columns === "3"
						? "lg:grid-cols-3"
						: "lg:grid-cols-4";

		return (
			<div className={`grid grid-cols-1 md:grid-cols-2 ${gridColsClass} gap-4`}>
				{stats.map(
					(
						stat: {
							label: string;
							value: string;
							description: string;
							icon: string;
							color: string;
						},
						index: number,
					) => (
						<Card
							key={`${stat.label}-${stat.value}-${index}`}
							className="bg-card border-border hover:border-accent transition-colors"
						>
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<CardTitle className="text-lg text-foreground">
										{stat.label}
									</CardTitle>
									{stat.icon !== "none" && (
										<div className={getColorClass(stat.color)}>
											{getIcon(stat.icon)}
										</div>
									)}
								</div>
							</CardHeader>
							<CardContent>
								<div
									className={`text-3xl font-bold mb-2 ${getColorClass(stat.color)}`}
								>
									{stat.value}
								</div>
								<div className="flex items-center text-sm text-muted-foreground">
									<span>{stat.description}</span>
								</div>
							</CardContent>
						</Card>
					),
				)}
			</div>
		);
	},
};
