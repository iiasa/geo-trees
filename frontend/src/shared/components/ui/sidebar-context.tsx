"use client";

import * as React from "react";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/utils";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "4rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextProps = {
	state: "expanded" | "collapsed";
	open: boolean;
	setOpen: (open: boolean) => void;
	openMobile: boolean;
	setOpenMobile: (open: boolean) => void;
	isMobile: boolean;
	toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
	const context = React.useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider.");
	}

	return context;
}

const SidebarProvider = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div"> & {
		defaultOpen?: boolean;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
	}
>(
	(
		{
			defaultOpen = true,
			open,
			onOpenChange,
			className,
			style,
			children,
			...props
		},
		ref,
	) => {
		const isMobile = useIsMobile();
		const [openMobile, setOpenMobile] = React.useState(false);

		// This is the internal state of the sidebar.
		// We use openProp and initialState to control the collapsed state.
		const [_open, _setOpen] = React.useState(defaultOpen);
		const openState = open ?? _open;
		const setOpen = React.useCallback(
			(value: boolean) => {
				_open !== value && _setOpen(value);
				onOpenChange?.(value);
			},
			[_open, onOpenChange],
		);

		// Helper to toggle sidebar.
		const toggleSidebar = React.useCallback(() => {
			if (isMobile) {
				setOpenMobile(!openMobile);
			} else {
				setOpen(!openState);
			}
		}, [isMobile, setOpen, openMobile, openState]);

		// Adds a keyboard shortcut to toggle sidebar.
		React.useEffect(() => {
			const handleKeyDown = (event: KeyboardEvent) => {
				if (
					event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
					(event.metaKey || event.ctrlKey)
				) {
					event.preventDefault();
					toggleSidebar();
				}
			};

			window.addEventListener("keydown", handleKeyDown);
			return () => window.removeEventListener("keydown", handleKeyDown);
		}, [toggleSidebar]);

		// We add a state so that we can detect when collapsed state
		// has changed and we need to update the cookie.
		const state = openState ? "expanded" : "collapsed";

		// The sidebar context value.
		const contextValue = React.useMemo<SidebarContextProps>(
			() => ({
				state,
				open: openState,
				setOpen,
				isMobile,
				openMobile,
				setOpenMobile,
				toggleSidebar,
			}),
			[state, openState, setOpen, isMobile, openMobile, toggleSidebar],
		);

		return (
			<SidebarContext.Provider value={contextValue}>
				<div
					style={
						{
							"--sidebar-width": SIDEBAR_WIDTH,
							"--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
							...style,
						} as React.CSSProperties
					}
					className={cn(
						"group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-background",
						className,
					)}
					ref={ref}
					{...props}
				>
					{children}
				</div>
			</SidebarContext.Provider>
		);
	},
);
SidebarProvider.displayName = "SidebarProvider";

export {
	SidebarProvider,
	useSidebar,
	SIDEBAR_COOKIE_NAME,
	SIDEBAR_COOKIE_MAX_AGE,
	SIDEBAR_WIDTH,
	SIDEBAR_WIDTH_MOBILE,
	SIDEBAR_WIDTH_ICON,
	SIDEBAR_KEYBOARD_SHORTCUT,
};
