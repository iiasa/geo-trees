import { createFileRoute, Link } from "@tanstack/react-router";
import { Database, Layers, Zap } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

export const Route = createFileRoute("/demo/start/ssr/")({
	component: RouteComponent,
});

function RouteComponent() {
	const demos = [
		{
			to: "/demo/start/ssr/spa-mode",
			title: "SPA Mode",
			description: "Single Page Application with client-side routing",
			icon: <Layers className="h-6 w-6" />,
			color: "bg-accent hover:bg-accent/90",
		},
		{
			to: "/demo/start/ssr/full-ssr",
			title: "Full SSR",
			description: "Complete server-side rendering with hydration",
			icon: <Zap className="h-6 w-6" />,
			color: "bg-accent hover:bg-accent/90",
		},
		{
			to: "/demo/start/ssr/data-only",
			title: "Data Only",
			description: "Server-side data fetching without full rendering",
			icon: <Database className="h-6 w-6" />,
			color: "bg-accent hover:bg-accent/90",
		},
	];

	return (
		<div className="w-full bg-background">
			<div className="w-full px-6 py-8">
				<div className="flex items-center justify-center min-h-screen">
					<div className="w-full max-w-4xl bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
						<div className="text-center">
							<div className="flex items-center justify-center gap-2 mb-4">
								<Badge variant="secondary">SSR Demos</Badge>
							</div>
							<h2 className="text-4xl font-bold text-foreground mb-2">
								Server-Side Rendering Examples
							</h2>
							<p className="text-muted-foreground mb-6">
								Explore different SSR approaches
							</p>
						</div>
						<div className="grid gap-4 md:grid-cols-1">
							{demos.map((demo) => (
								<Button
									key={demo.to}
									asChild
									className={`${demo.color} h-auto p-6 text-white font-semibold shadow-lg transition-all hover:shadow-xl`}
								>
									<Link to={demo.to} className="flex items-center gap-4">
										<div className="flex-shrink-0">{demo.icon}</div>
										<div className="text-left">
											<div className="text-xl font-bold">{demo.title}</div>
											<div className="text-sm opacity-90">
												{demo.description}
											</div>
										</div>
									</Link>
								</Button>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
