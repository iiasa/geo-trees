import { Link } from "@tanstack/react-router";
import { useAuthCombined } from "@/features/auth/hooks/use-auth";
import { Button } from "@/shared/components/ui/button";

export function MapHeader() {
	const { isAuthenticated, login, logout, user } = useAuthCombined();

	return (
		<header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3">
			<div className="flex items-center gap-4">
				<nav className="flex items-center gap-4">
					<Link
						to="/map"
						className="text-sm font-medium text-white hover:text-white/80 transition-colors"
					>
						Map
					</Link>
					<Link
						to="/"
						className="text-sm font-medium text-white hover:text-white/80 transition-colors"
					>
						About
					</Link>
				</nav>
			</div>

			<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
				<Link to="/map" className="flex items-center">
					<img
						src="/logo192.png"
						alt="GEO TREES"
						className="h-10 w-10 object-contain"
					/>
				</Link>
			</div>

			<div className="flex items-center gap-3">
				{isAuthenticated ? (
					<>
						<span className="text-sm text-white/80">
							{user?.name || user?.email || "User"}
						</span>
						<Button
							variant="outline"
							size="sm"
							onClick={logout}
							className="border-white/60 text-white bg-transparent hover:bg-white/10 hover:text-white"
						>
							Logout
						</Button>
					</>
				) : (
					<>
						<Button
							variant="outline"
							size="sm"
							onClick={login}
							className="border-primary text-primary bg-transparent hover:bg-primary/10"
						>
							Login
						</Button>
						<Button size="sm" onClick={login}>
							Sign up
						</Button>
					</>
				)}
			</div>
		</header>
	);
}
