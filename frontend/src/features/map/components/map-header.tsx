import { Link } from "@tanstack/react-router";
import { useAuthCombined } from "@/features/auth/hooks/use-auth";

export function MapHeader() {
	const { isAuthenticated, login, logout, user } = useAuthCombined();

	return (
		<header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3">
			<div className="flex items-center gap-6">
				<Link
					to="/map"
					className="text-sm font-semibold text-white hover:text-gray-200 transition-colors"
				>
					GEO TREES
				</Link>
				<nav className="flex items-center gap-4">
					<Link
						to="/map"
						className="text-sm text-gray-300 hover:text-white transition-colors"
					>
						Map
					</Link>
					<Link
						to="/"
						className="text-sm text-gray-300 hover:text-white transition-colors"
					>
						About
					</Link>
				</nav>
			</div>
			<div className="flex items-center gap-3">
				{isAuthenticated ? (
					<>
						<span className="text-sm text-gray-300">
							{user?.name || user?.email || "User"}
						</span>
						<button
							type="button"
							onClick={logout}
							className="px-4 py-1.5 text-sm text-gray-300 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
						>
							Logout
						</button>
					</>
				) : (
					<>
						<button
							type="button"
							onClick={login}
							className="px-4 py-1.5 text-sm text-gray-300 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
						>
							Login
						</button>
						<button
							type="button"
							onClick={login}
							className="px-4 py-1.5 text-sm text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors"
						>
							Sign up
						</button>
					</>
				)}
			</div>
		</header>
	);
}
