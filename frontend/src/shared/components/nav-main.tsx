import type { Icon } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
	SidebarMenuSubTrigger,
	useSidebar,
} from "@/shared/components/ui/sidebar";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: Icon;
		items?: { title: string; url: string }[];
	}[];
}) {
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";

	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
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
													{item.icon && (
														<item.icon className="size-4 shrink-0" />
													)}
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
											{item.icon && <item.icon className="size-4 shrink-0" />}
											<span className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:overflow-hidden">
												{item.title}
											</span>
										</Link>
									</SidebarMenuButton>
								)}
							</SidebarMenuItem>
						</Collapsible>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
