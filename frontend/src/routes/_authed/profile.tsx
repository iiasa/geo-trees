import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Shield, User } from "lucide-react";
import { PROFILE_LABELS, PROFILE_ROUTES } from "@/features/profile/constants";
import { PageHeader } from "@/shared/components/page-header";
import { PageLayout } from "@/shared/components/page-layout";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

export const Route = createFileRoute("/_authed/profile")({
	component: ProfileLayout,
});

function ProfileLayout() {
	return (
		<PageLayout>
			<PageHeader
				title="Profile"
				description="Manage your account settings and preferences"
			/>

			<Tabs defaultValue="general" className="space-y-4 sm:space-y-6">
				<TabsList className="grid w-full grid-cols-2 gap-2">
					<Link to={PROFILE_ROUTES.GENERAL}>
						<TabsTrigger
							value="general"
							className="flex items-center gap-2 w-full"
						>
							<User className="h-4 w-4" />
							<span className="hidden sm:inline">
								{PROFILE_LABELS.TABS.GENERAL}
							</span>
							<span className="sm:hidden">General</span>
						</TabsTrigger>
					</Link>
					<Link to={PROFILE_ROUTES.SECURITY}>
						<TabsTrigger
							value="security"
							className="flex items-center gap-2 w-full"
						>
							<Shield className="h-4 w-4" />
							<span className="hidden sm:inline">
								{PROFILE_LABELS.TABS.SECURITY}
							</span>
							<span className="sm:hidden">Security</span>
						</TabsTrigger>
					</Link>
				</TabsList>

				<Outlet />
			</Tabs>
		</PageLayout>
	);
}
