"use client";

import * as React from "react";
import { cn } from "@/shared/utils";

export const SidebarFooter = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		data-sidebar="footer"
		className={cn(
			"flex flex-col gap-2 p-2 shrink-0",
			"group-data-[collapsible=icon]:p-2",
			className,
		)}
		{...props}
	/>
));
SidebarFooter.displayName = "SidebarFooter";
