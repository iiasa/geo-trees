import { Link } from "@tanstack/react-router";
import { IconLogin, IconLogout, IconUser } from "@tabler/icons-react";
import { useAuthCombined } from "@/features/auth/hooks/use-auth";
import { PROFILE_ROUTES } from "@/features/profile/constants";
import { Button } from "@/shared/components/ui/button";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/shared/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const NAV_LINKS = [
	{ to: "/", label: "Home" },
	{ to: "/map", label: "Map" },
	{ to: "/dashboard", label: "Dashboard" },
] as const;

function UserInitials(name?: string, email?: string) {
	const source = name || email || "U";
	return source
		.split(/[\s@]+/)
		.slice(0, 2)
		.map((s) => s[0]?.toUpperCase() ?? "")
		.join("");
}

export function MapHeader() {
	const { isAuthenticated, isLoading, login, logout, user } = useAuthCombined();

	return (
		<header className="absolute top-0 left-0 right-0 z-20 flex h-14 items-center justify-between gap-4 px-4 bg-white/80 backdrop-blur-md border-b border-black/5 shadow-sm">
			<div className="flex items-center gap-3">
				<Link to="/map" className="flex items-center gap-2">
					<img
						src="/logo192.png"
						alt="GEO TREES"
						className="h-8 w-8 object-contain"
					/>
					<span className="text-sm font-semibold text-foreground hidden sm:inline">
						Geo Trees
					</span>
				</Link>

				<div className="h-5 w-px bg-border" />

				<nav className="flex items-center gap-1">
					{NAV_LINKS.map((link) => (
						<Link
							key={link.to}
							to={link.to}
							className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground"
							activeProps={{
								className:
									"rounded-md px-3 py-1.5 text-sm font-medium bg-black/5 text-foreground",
							}}
							activeOptions={{ exact: link.to === "/" }}
						>
							{link.label}
						</Link>
					))}
				</nav>
			</div>

			<div className="flex items-center gap-2">
				{isLoading ? (
					<div className="size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
				) : isAuthenticated ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="flex items-center gap-2 rounded-full p-0.5 transition-colors hover:bg-black/5"
							>
								<Avatar className="size-8">
									{user?.picture && (
										<AvatarImage src={user.picture} alt={user.name || "User"} />
									)}
									<AvatarFallback className="text-xs bg-primary text-primary-foreground">
										{UserInitials(user?.name, user?.email)}
									</AvatarFallback>
								</Avatar>
								<span className="text-sm font-medium text-foreground hidden md:inline pr-2">
									{user?.name || user?.preferred_username || "User"}
								</span>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuItem asChild>
								<Link
									to={PROFILE_ROUTES.INDEX}
									className="flex items-center gap-2"
								>
									<IconUser className="size-4" />
									Profile
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={logout}
								className="flex items-center gap-2"
							>
								<IconLogout className="size-4" />
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<Button size="sm" onClick={login} className="gap-1.5">
						<IconLogin className="size-4" />
						<span className="hidden sm:inline">Login</span>
					</Button>
				)}
			</div>
		</header>
	);
}
