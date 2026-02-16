import { Link } from "@tanstack/react-router";

import { TOP_MENU_LINKS } from "@/shared/constants/navigation";

interface PagesLayoutProps {
	children: React.ReactNode;
}

export function PagesLayout({ children }: PagesLayoutProps) {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="border-b bg-card">
				<div className="mx-auto container flex h-14 items-center gap-3 px-4 sm:px-6 lg:px-8">
					<nav className="flex flex-1 items-center gap-1 overflow-x-auto">
						{TOP_MENU_LINKS.map((item) => (
							<Link
								key={item.title}
								to={item.url}
								className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
								activeProps={{
									className:
										"rounded-md px-3 py-2 text-sm font-medium bg-accent text-accent-foreground",
								}}
								activeOptions={{ exact: item.url === "/" }}
							>
								{item.title}
							</Link>
						))}
					</nav>
				</div>
			</header>
			<main className="mx-auto container px-4 py-8 sm:px-6 lg:px-8">
				{children}
			</main>
		</div>
	);
}
