"use client";

import * as React from "react";
import { cn } from "@/shared/utils";
import { useSidebar } from "./sidebar-context";

export const SidebarInset = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";

	return (
		<main
			ref={ref}
			className={cn(
				"relative flex min-h-svh flex-1 flex-col bg-background transition-[margin-left] duration-200",
				"ml-0 md:ml-[var(--sidebar-width-icon)]",
				isCollapsed
					? "md:ml-[var(--sidebar-width-icon)]"
					: "md:ml-[var(--sidebar-width)]",
				"peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2",
				"peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:ml-[calc(theme(spacing.4)*2)]",
				className,
			)}
			{...props}
		/>
	);
});
SidebarInset.displayName = "SidebarInset";
