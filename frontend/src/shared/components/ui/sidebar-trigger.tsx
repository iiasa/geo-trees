"use client";

import { PanelLeftIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import { useSidebar } from "./sidebar-context";

export const SidebarTrigger = React.forwardRef<
	React.ElementRef<typeof Button>,
	React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();

	return (
		<Button
			ref={ref}
			data-sidebar="trigger"
			variant="ghost"
			size="sm"
			className={className}
			onClick={(event) => {
				onClick?.(event);
				toggleSidebar();
			}}
			{...props}
		>
			<PanelLeftIcon />
			<span className="sr-only">Toggle Sidebar</span>
		</Button>
	);
});
SidebarTrigger.displayName = "SidebarTrigger";
