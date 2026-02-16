"use client";

import * as React from "react";
import { cn } from "@/shared/utils";

export const SidebarHeader = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		data-sidebar="header"
		className={cn(
			"flex flex-col gap-2 p-2 shrink-0",
			"group-data-[collapsible=icon]:p-2",
			className,
		)}
		{...props}
	/>
));
SidebarHeader.displayName = "SidebarHeader";
