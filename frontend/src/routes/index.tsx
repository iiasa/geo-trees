import { createFileRoute, Link } from "@tanstack/react-router";
import {
	AlertCircle,
	ArrowRight,
	LogIn,
	Route as RouteIcon,
	Server,
	Shield,
	Sparkles,
	User,
	Waves,
	Zap,
} from "lucide-react";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { useAuthCombined } from "@/features/auth/hooks/use-auth";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const { user, isAuthenticated, isLoading, login, error, clearError } =
		useAuthCombined();

	const features = [
		{
			icon: <Zap className="w-12 h-12 text-cyan-400" />,
			title: "Geospatial Analysis",
			description:
				"Powerful tools for analyzing tree cover, forest density, and land use change across the globe.",
		},
		{
			icon: <Server className="w-12 h-12 text-cyan-400" />,
			title: "Data Management",
			description:
				"Centralized platform for managing and curating geospatial tree datasets with full audit trails.",
		},
		{
			icon: <RouteIcon className="w-12 h-12 text-cyan-400" />,
			title: "Interactive Maps",
			description:
				"Explore forest data through interactive map visualizations with multiple data layers.",
		},
		{
			icon: <Shield className="w-12 h-12 text-cyan-400" />,
			title: "Research-Grade Quality",
			description:
				"Built for scientific research with rigorous data validation and quality assurance workflows.",
		},
		{
			icon: <Waves className="w-12 h-12 text-cyan-400" />,
			title: "Global Coverage",
			description:
				"Access tree and forest data from around the world, supporting global monitoring initiatives.",
		},
		{
			icon: <Sparkles className="w-12 h-12 text-cyan-400" />,
			title: "Open Science",
			description:
				"Supporting open data principles and collaborative research for forest conservation and monitoring.",
		},
	];

	return (
		<div className="min-h-screen bg-background">
			<section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 text-center overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
				<div className="relative max-w-5xl mx-auto">
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
						<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground [letter-spacing:-0.08em]">
							<span className="text-muted-foreground">GEO</span>{" "}
							<span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
								TREES
							</span>
						</h1>
					</div>
					<p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-3 sm:mb-4 font-light px-4">
						IIASA Global Forest Monitoring Platform
					</p>
					<p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
						Explore, analyze, and manage geospatial tree data with powerful
						tools for forest monitoring and research.
					</p>

					{/* Authentication-based content */}
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
						</div>
					) : isAuthenticated ? (
						<div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 mb-8 max-w-md mx-auto">
							<div className="flex items-center gap-4 mb-4">
								{user?.picture ? (
									<img
										src={user.picture}
										alt={user.name || "User"}
										className="w-12 h-12 rounded-full"
									/>
								) : (
									<div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
										<User size={24} />
									</div>
								)}
								<div>
									<h3 className="text-xl font-semibold text-foreground">
										Welcome back,{" "}
										{user?.name || user?.preferred_username || "User"}!
									</h3>
									<p className="text-muted-foreground text-sm">
										You're signed in and ready to explore
									</p>
								</div>
							</div>
							<div className="flex flex-col sm:flex-row gap-3">
								<Button asChild className="flex-1">
									<Link to="/dashboard">
										<User size={16} />
										Go to Dashboard
									</Link>
								</Button>
								<Button asChild variant="outline" className="flex-1">
									<a
										href="https://iiasa.ac.at"
										target="_blank"
										rel="noopener noreferrer"
									>
										IIASA
										<ArrowRight size={16} />
									</a>
								</Button>
							</div>
						</div>
					) : (
						<div className="flex flex-col items-center gap-4">
							{error && (
								<Alert variant="destructive" className="max-w-md">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>Authentication Error</AlertTitle>
									<AlertDescription>
										{error}
										<Button
											variant="link"
											size="sm"
											onClick={clearError}
											className="h-auto p-0 ml-2 text-destructive hover:text-destructive/80"
										>
											Dismiss
										</Button>
									</AlertDescription>
								</Alert>
							)}
							<Button
								onClick={login}
								disabled={isLoading}
								size="lg"
								className="px-8"
							>
								<LogIn size={16} />
								{isLoading ? "Signing In..." : "Sign In to Get Started"}
							</Button>
							<p className="text-muted-foreground text-sm mt-2">
								Sign in to access the Geo Trees platform
							</p>
							<Link
								to="/auth/register"
								className="text-sm text-primary hover:underline"
							>
								Don't have an account? Create one
							</Link>
						</div>
					)}
				</div>
			</section>

			<section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{features.map((feature) => (
						<Card
							key={feature.title}
							className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
						>
							<CardHeader>
								<div className="mb-2">{feature.icon}</div>
								<CardTitle className="text-foreground">
									{feature.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-muted-foreground leading-relaxed">
									{feature.description}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Footer */}
			<footer className="py-12 px-6 border-t border-border/50 bg-background/50 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
						<div>
							<h3 className="text-lg font-semibold text-foreground mb-4">
								Geo Trees
							</h3>
							<p className="text-muted-foreground text-sm leading-relaxed">
								IIASA Global Forest Monitoring Platform. Explore, analyze, and
								manage geospatial tree data.
							</p>
						</div>
						<div>
							<h4 className="text-sm font-semibold text-foreground mb-4">
								Resources
							</h4>
							<ul className="space-y-2 text-sm">
								<li>
									<a
										href="https://iiasa.ac.at"
										className="text-muted-foreground hover:text-primary transition-colors"
									>
										IIASA
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="text-sm font-semibold text-foreground mb-4">
								Community
							</h4>
							<ul className="space-y-2 text-sm">
								<li>
									<a
										href="https://github.com/iiasa/geo-trees"
										className="text-muted-foreground hover:text-primary transition-colors"
									>
										GitHub
									</a>
								</li>
							</ul>
						</div>
					</div>
					<Separator className="mb-8" />
					<div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
						<p>© 2025 IIASA. All rights reserved.</p>
						<div className="flex gap-6 mt-4 md:mt-0">
							<a
								href="#privacy"
								className="hover:text-primary transition-colors"
							>
								Privacy
							</a>
							<a href="#terms" className="hover:text-primary transition-colors">
								Terms
							</a>
							<a
								href="#support"
								className="hover:text-primary transition-colors"
							>
								Support
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
