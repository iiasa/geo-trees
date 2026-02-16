"use client";

import * as React from "react";
import { useSidebar } from "./sidebar-context";
import { cn } from "@/shared/utils";

export const SidebarRail = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
	const { toggleSidebar, state } = useSidebar();
	const isCollapsed = state === "collapsed";

	return (
		<div
			ref={ref}
			data-sidebar="rail"
			className={cn(
				"absolute right-0 top-0 h-full pointer-events-none z-10",
				isCollapsed ? "w-full" : "w-12",
				className,
			)}
			{...props}
		>
			<button
				type="button"
				onClick={toggleSidebar}
				aria-label="Toggle Sidebar"
				className={cn(
					"absolute flex h-7 w-7 items-center justify-center rounded-md transition-all pointer-events-auto z-20 shadow-md",
					"bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80",
					isCollapsed ? "bottom-3 left-1/2 -translate-x-1/2" : "top-3 right-3",
				)}
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						fill="currentColor"
						d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708 0L8 8.707l-2.646 2.647a.5.5 0 0 1-.708 0M7.293 8l-2.647 2.646a.5.5 0 0 1-.708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708 0z"
					/>
				</svg>
			</button>
		</div>
	);
});
SidebarRail.displayName = "SidebarRail";
