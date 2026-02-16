import {
	IconBuilding,
	IconCode,
	IconDashboard,
	IconFile,
	IconFunction,
	IconHome,
	IconInnerShadowTop,
	IconListDetails,
	IconMessage,
	IconNetwork,
	IconNote,
	IconSettings,
	IconShield,
	IconUser,
	IconUsers,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";

const NAV_LABELS = {
	HOME: "Home",
	DASHBOARD: "Dashboard",
	USERS: "Users",
	ROLES: "Roles",
	TENANTS: "Tenants",
	PAGES: "Pages",
	COMMENTS: "Comments",
	NAVIGATION: "Navigation",
	SETTINGS: "Settings",
	PROFILE: "Profile",
	API_CLIENT: "API Client",
	SERVER_FUNCTIONS: "Server Functions",
	API_REQUEST: "API Request",
	SSR_DEMOS: "SSR Demos",
	SSR_SPA_MODE: "SPA Mode",
	SSR_FULL: "Full SSR",
	SSR_DATA_ONLY: "Data Only",
	BRAND: "TanStack Start",
} as const;

export type NavItem = {
	title: string;
	url: string;
	icon?: Icon;
	items?: { title: string; url: string }[];
};

export const NAV_ITEMS: {
	main: NavItem[];
	identityManagement: NavItem[];
	cms: NavItem[];
	system: NavItem[];
	demos: NavItem[];
} = {
	main: [
		{
			title: NAV_LABELS.HOME,
			url: "/",
			icon: IconHome,
		},
		{
			title: NAV_LABELS.DASHBOARD,
			url: "/dashboard",
			icon: IconDashboard,
		},
	],
	identityManagement: [
		{
			title: NAV_LABELS.USERS,
			url: "/admin/users",
			icon: IconUsers,
		},
		{
			title: NAV_LABELS.ROLES,
			url: "/admin/roles",
			icon: IconShield,
		},
		{
			title: NAV_LABELS.TENANTS,
			url: "/admin/tenants",
			icon: IconBuilding,
		},
	],
	cms: [
		{
			title: NAV_LABELS.PAGES,
			url: "/admin/cms/pages",
			icon: IconFile,
		},
		{
			title: NAV_LABELS.NAVIGATION,
			url: "/admin/cms/navigation",
			icon: IconListDetails,
		},
		{
			title: NAV_LABELS.COMMENTS,
			url: "/admin/cms/comments",
			icon: IconMessage,
		},
	],
	system: [
		{
			title: NAV_LABELS.SETTINGS,
			url: "/settings",
			icon: IconSettings,
		},
		{
			title: NAV_LABELS.PROFILE,
			url: "/profile",
			icon: IconUser,
		},
	],
	demos: [
		{
			title: NAV_LABELS.API_CLIENT,
			url: "/demo/client",
			icon: IconCode,
		},
		{
			title: NAV_LABELS.SERVER_FUNCTIONS,
			url: "/demo/start/server-funcs",
			icon: IconFunction,
		},
		{
			title: NAV_LABELS.API_REQUEST,
			url: "/demo/start/api-request",
			icon: IconNetwork,
		},
		{
			title: NAV_LABELS.SSR_DEMOS,
			url: "/demo/start/ssr",
			icon: IconNote,
			items: [
				{
					title: NAV_LABELS.SSR_SPA_MODE,
					url: "/demo/start/ssr/spa-mode",
				},
				{
					title: NAV_LABELS.SSR_FULL,
					url: "/demo/start/ssr/full-ssr",
				},
				{
					title: NAV_LABELS.SSR_DATA_ONLY,
					url: "/demo/start/ssr/data-only",
				},
			],
		},
	],
};

export const NAV_BRAND = {
	title: NAV_LABELS.BRAND,
	icon: IconInnerShadowTop,
} as const;

export const TOP_MENU_LINKS: NavItem[] = [
	...NAV_ITEMS.main,
	...NAV_ITEMS.system,
];
