"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/utils";
import { Sheet, SheetContent } from "./sheet";
import {
	SidebarProvider,
	useSidebar,
	SIDEBAR_WIDTH,
	SIDEBAR_WIDTH_MOBILE,
	SIDEBAR_WIDTH_ICON,
} from "./sidebar-context";
import { SidebarTrigger } from "./sidebar-trigger";
import { SidebarRail } from "./sidebar-rail";
import { SidebarInset } from "./sidebar-inset";
import { SidebarInput } from "./sidebar-input";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
	SidebarMenuSubTrigger,
} from "./sidebar-menu";
import { SidebarContent } from "./sidebar-content";
import { SidebarHeader } from "./sidebar-header";
import { SidebarFooter } from "./sidebar-footer";

const sidebarVariants = cva(
	"fixed left-0 top-0 z-50 bg-sidebar text-sidebar-foreground flex flex-col h-screen overflow-hidden",
	{
		variants: {
			variant: {
				default: "",
				inset: "",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const Sidebar = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div"> & {
		variant?: VariantProps<typeof sidebarVariants>["variant"];
	}
>(({ className, variant = "default", ...props }, ref) => {
	const isMobile = useIsMobile();
	const { openMobile, setOpenMobile, state } = useSidebar();

	if (isMobile) {
		return (
			<Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
				<SheetContent
					className="w-[270px] p-0 bg-sidebar text-sidebar-foreground"
					style={
						{
							"--sidebar-width": SIDEBAR_WIDTH_MOBILE,
						} as React.CSSProperties
					}
					{...props}
				>
					{props.children}
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<div
			ref={ref}
			data-state={state}
			data-collapsible={state === "collapsed" ? "icon" : "default"}
			className={cn(sidebarVariants({ variant }), "group", className)}
			style={
				{
					"--sidebar-width": SIDEBAR_WIDTH,
					"--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
					width: state === "collapsed" ? SIDEBAR_WIDTH_ICON : SIDEBAR_WIDTH,
					transition: "width 200ms ease-in-out",
				} as React.CSSProperties
			}
			{...props}
		>
			{props.children}
		</div>
	);
});
Sidebar.displayName = "Sidebar";

const SidebarGroup = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		data-sidebar="group"
		className={cn(
			"relative flex w-full min-w-0 flex-col p-2",
			"group-data-[collapsible=icon]:p-2",
			className,
		)}
		{...props}
	/>
));
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		data-sidebar="group-label"
		className={cn(
			"duration-200 flex h-auto shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-auto [&>svg]:shrink-0",
			"group-data-[collapsible=icon]:-mt-8",
			"group-data-[collapsible=icon]:opacity-0",
			className,
		)}
		{...props}
	/>
));
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupAction = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			ref={ref}
			data-sidebar="group-action"
			className={cn(
				"absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-auto [&>svg]:shrink-0",
				// Increases the hit area of the button on mobile.
				"after:absolute after:-inset-2 after:md:hidden",
				"group-data-[collapsible=icon]:hidden",
				className,
			)}
			{...props}
		/>
	);
});
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarGroupContent = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		data-sidebar="group-content"
		className={cn("w-full text-sm", className)}
		{...props}
	/>
));
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarSeparator = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		data-sidebar="separator"
		className={cn("mx-2 w-auto border-t", className)}
		{...props}
	/>
));
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarBadge = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		data-sidebar="badge"
		className={cn(
			"absolute right-3 flex h-6 w-6 items-center justify-center rounded-md p-1 text-sidebar-foreground ring-1",
			"peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
			"peer-data-[size=sm]/menu-button:top-1",
			"peer-data-[size=default]/menu-button:top-1.5",
			"peer-data-[size=lg]/menu-button:top-2.5",
			"group-data-[collapsible=icon]:hidden",
			className,
		)}
		{...props}
	/>
));
SidebarBadge.displayName = "SidebarBadge";

const SidebarSkeleton = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		data-sidebar="skeleton"
		className={cn("rounded-md h-8 bg-sidebar-accent/50", className)}
		{...props}
	/>
));
SidebarSkeleton.displayName = "SidebarSkeleton";

export {
	Sidebar,
	SidebarProvider,
	SidebarTrigger,
	SidebarRail,
	SidebarInset,
	SidebarInput,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
	SidebarMenuSubTrigger,
	SidebarContent,
	SidebarHeader,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarSeparator,
	SidebarBadge,
	SidebarSkeleton,
	useSidebar,
};
