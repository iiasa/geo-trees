import { IconDotsVertical, IconLogout, IconUser } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { PROFILE_ROUTES } from "@/features/profile/constants";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/shared/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/shared/components/ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/shared/components/ui/tooltip";

export function NavUser({
	user,
}: {
	user?: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	const { isMobile } = useSidebar();
	const { logout, authState } = useAuth();

	// Use auth user data if available, otherwise fallback to prop
	const displayUser = authState.user
		? {
				name:
					authState.user.name || authState.user.preferred_username || "User",
				email: authState.user.email || "",
				avatar: authState.user.picture || "",
			}
		: user || {
				name: "Guest",
				email: "",
				avatar: "",
			};

	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";

	const userButton = (
		<SidebarMenuButton
			size="lg"
			className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!p-2"
		>
			<div className="flex items-center gap-2 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
				{isCollapsed && !displayUser.avatar ? (
					<IconUser className="h-7 w-7 shrink-0" />
				) : (
					<Avatar className="h-8 w-8 rounded-lg grayscale group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7 shrink-0">
						<AvatarImage src={displayUser.avatar} alt={displayUser.name} />
						<AvatarFallback className="rounded-lg">
							{displayUser.name.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				)}
				<div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:w-0">
					<span className="truncate font-medium">{displayUser.name}</span>
					<span className="text-muted-foreground truncate text-xs">
						{displayUser.email}
					</span>
				</div>
				<IconDotsVertical className="ml-auto size-4 shrink-0 group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:w-0" />
			</div>
		</SidebarMenuButton>
	);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					{isCollapsed ? (
						<Tooltip>
							<TooltipTrigger asChild>
								<DropdownMenuTrigger asChild>{userButton}</DropdownMenuTrigger>
							</TooltipTrigger>
							<TooltipContent side="right" sideOffset={8}>
								<div className="flex flex-col gap-0.5">
									<span className="font-medium">{displayUser.name}</span>
									{displayUser.email && (
										<span className="text-xs text-muted-foreground">
											{displayUser.email}
										</span>
									)}
								</div>
							</TooltipContent>
						</Tooltip>
					) : (
						<DropdownMenuTrigger asChild>{userButton}</DropdownMenuTrigger>
					)}
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={displayUser.avatar}
										alt={displayUser.name}
									/>
									<AvatarFallback className="rounded-lg">
										{displayUser.name.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{displayUser.name}
									</span>
									<span className="text-muted-foreground truncate text-xs">
										{displayUser.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<Link to={PROFILE_ROUTES.INDEX}>
							<DropdownMenuItem>
								<IconUser />
								Profile
							</DropdownMenuItem>
						</Link>
						<DropdownMenuItem onClick={logout}>
							<IconLogout />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
