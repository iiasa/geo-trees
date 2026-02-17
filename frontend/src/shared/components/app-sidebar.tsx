import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { NAV_BRAND, NAV_ITEMS } from "@/shared/constants/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { NavMain } from "@/shared/components/nav-main";
import { NavUser } from "@/shared/components/nav-user";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
	SidebarMenuSubTrigger,
	SidebarRail,
	useSidebar,
} from "@/shared/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { authState } = useAuth();
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";
	const userRoles = normalizeRoles(authState.user);
	const isAdmin = userRoles.includes("admin");

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							tooltip="Geo Trees"
							className="data-[slot=sidebar-menu-button]:!p-1.5 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!px-2"
						>
							<div className="flex items-center gap-2 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center">
								<NAV_BRAND.icon className="!size-5 shrink-0" />
								<span className="text-base font-semibold group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:w-0">
									{NAV_BRAND.title}
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={NAV_ITEMS.main} />

				{isAdmin && (
					<>
						<SidebarGroup>
							<SidebarGroupLabel className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0">
								Identity Management
							</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{NAV_ITEMS.identityManagement.map((item) => {
										const IconComponent = item.icon;
										return (
											<SidebarMenuItem key={item.title}>
												<SidebarMenuButton asChild tooltip={item.title}>
													<Link to={item.url}>
														{IconComponent ? (
															<IconComponent className="size-4 shrink-0" />
														) : null}
														<span className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:w-0">
															{item.title}
														</span>
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										);
									})}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>

						<SidebarGroup>
							<SidebarGroupLabel className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0">
								CMS
							</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{NAV_ITEMS.cms.map((item) => {
										const IconComponent = item.icon;
										return (
											<SidebarMenuItem key={item.title}>
												<SidebarMenuButton asChild tooltip={item.title}>
													<Link to={item.url}>
														{IconComponent ? (
															<IconComponent className="size-4 shrink-0" />
														) : null}
														<span className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:w-0">
															{item.title}
														</span>
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										);
									})}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</>
				)}

				<SidebarGroup>
					<SidebarGroupLabel className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0">
						System
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{NAV_ITEMS.system.map((item) => {
								const IconComponent = item.icon;
								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild tooltip={item.title}>
											<Link to={item.url}>
												{IconComponent ? (
													<IconComponent className="size-4 shrink-0" />
												) : null}
												<span className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:w-0">
													{item.title}
												</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0">
						Demos
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{NAV_ITEMS.demos.map((item) => {
								const IconComponent = item.icon;
								return (
									<Collapsible key={item.title} asChild defaultOpen={false}>
										<SidebarMenuItem>
											{item.items ? (
												<>
													<div className="relative flex items-center group/nav-item">
														<SidebarMenuButton
															asChild
															tooltip={item.title}
															className="flex-1"
														>
															<Link to={item.url}>
																{IconComponent ? (
																	<IconComponent className="size-4 shrink-0" />
																) : null}
																<span className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:w-0">
																	{item.title}
																</span>
															</Link>
														</SidebarMenuButton>
														<CollapsibleTrigger asChild>
															<button
																type="button"
																className="absolute right-2 p-1 hover:bg-sidebar-accent rounded-sm group-data-[collapsible=icon]:hidden"
															>
																<ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 shrink-0" />
															</button>
														</CollapsibleTrigger>
													</div>
													{!isCollapsed && (
														<CollapsibleContent>
															<SidebarMenuSub>
																{item.items.map((subItem) => (
																	<SidebarMenuSubItem key={subItem.title}>
																		<SidebarMenuSubTrigger asChild>
																			<Link to={subItem.url}>
																				<span>{subItem.title}</span>
																			</Link>
																		</SidebarMenuSubTrigger>
																	</SidebarMenuSubItem>
																))}
															</SidebarMenuSub>
														</CollapsibleContent>
													)}
												</>
											) : (
												<SidebarMenuButton asChild tooltip={item.title}>
													<Link to={item.url}>
														{IconComponent ? (
															<IconComponent className="size-4 shrink-0" />
														) : null}
														<span className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:w-0">
															{item.title}
														</span>
													</Link>
												</SidebarMenuButton>
											)}
										</SidebarMenuItem>
									</Collapsible>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

function normalizeRoles(user: { roles?: string[] } | null): string[] {
	if (!user) {
		return [];
	}

	if (Array.isArray(user.roles)) {
		return user.roles.map((role) => role.toLowerCase());
	}

	return [];
}
