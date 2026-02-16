import { AppSidebar } from "@/shared/components/app-sidebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/shared/components/ui/sidebar";

interface SidebarLayoutProps {
	children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 md:px-6">
					<SidebarTrigger className="-ml-1" />
				</header>
				<div className="flex flex-1 flex-col gap-4 p-2 sm:p-4 md:p-6">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
