"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { useSidebar } from "./sidebar-context";

const sidebarMenuButtonVariants = cva(
	"peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-has-[[data-variant=inset]]:w-full data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:font-medium group-has-[[data-variant=inset]]:h-8 group-has-[[data-variant=inset]]:justify-normal group-has-[[data-variant=inset]]:px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:gap-0",
	{
		variants: {
			variant: {
				default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
				outline:
					"bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
			},
			size: {
				default: "h-8 text-sm",
				sm: "h-7 text-xs",
				lg: "h-12 text-sm group-data-[collapsible=icon]:h-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

const SidebarMenu = React.forwardRef<
	HTMLUListElement,
	React.ComponentProps<"ul"> & {
		variant?: VariantProps<typeof sidebarMenuButtonVariants>["variant"];
		size?: VariantProps<typeof sidebarMenuButtonVariants>["size"];
	}
>(({ className, variant = "default", size = "default", ...props }, ref) => (
	<ul
		ref={ref}
		data-sidebar="menu"
		className={cn("flex min-h-0 flex-col gap-1", className)}
		{...props}
	/>
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuButton = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<"button"> &
		VariantProps<typeof sidebarMenuButtonVariants> & {
			asChild?: boolean;
			isActive?: boolean;
			tooltip?: string;
		}
>(
	(
		{ asChild = false, isActive, variant, size, className, tooltip, ...props },
		ref,
	) => {
		const { state } = useSidebar();
		const isCollapsed = state === "collapsed";
		const Comp = asChild ? Slot : "button";

		const button = (
			<Comp
				ref={ref}
				data-sidebar="menu-button"
				data-size={size}
				data-active={isActive}
				className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
				{...props}
			/>
		);

		if (tooltip && isCollapsed) {
			return (
				<Tooltip>
					<TooltipTrigger asChild>{button}</TooltipTrigger>
					<TooltipContent side="right" sideOffset={8}>
						{tooltip}
					</TooltipContent>
				</Tooltip>
			);
		}

		return button;
	},
);
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuItem = React.forwardRef<
	HTMLLIElement,
	React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
	<li
		ref={ref}
		data-sidebar="menu-item"
		className={cn("group/menu-item relative", className)}
		{...props}
	/>
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuSub = React.forwardRef<
	HTMLUListElement,
	React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
	<ul
		ref={ref}
		data-sidebar="menu-sub"
		className={cn(
			"mx-3.5 flex min-w-[8rem] flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
			"group-data-[collapsible=icon]:hidden",
			className,
		)}
		{...props}
	/>
));
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef<
	HTMLAnchorElement,
	React.ComponentProps<"a"> & {
		asChild?: boolean;
		isActive?: boolean;
	}
>(({ asChild = false, isActive, className, ...props }, ref) => {
	const Comp = asChild ? Slot : "a";

	return (
		<Comp
			ref={ref}
			data-sidebar="menu-sub-button"
			data-active={isActive}
			className={cn(
				"flex h-full cursor-pointer items-center rounded-md px-2 py-1 text-sm outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2",
				className,
			)}
			{...props}
		/>
	);
});
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubTrigger = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<"button"> & {
		asChild?: boolean;
		isActive?: boolean;
	}
>(({ asChild = false, isActive, className, ...props }, ref) => {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			ref={ref}
			data-sidebar="menu-sub-trigger"
			data-active={isActive}
			className={cn(
				"flex h-7 cursor-pointer items-center rounded-md px-2 text-sm outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2",
				className,
			)}
			{...props}
		/>
	);
});
SidebarMenuSubTrigger.displayName = "SidebarMenuSubTrigger";

export {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
	SidebarMenuSubTrigger,
};
