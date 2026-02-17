import { createFileRoute } from "@tanstack/react-router";
import {
	Clock,
	Mail,
	MessageSquare,
	Settings as SettingsIcon,
} from "lucide-react";
import { CommentSettingsForm } from "@/features/settings/components/comment-settings-form";
import { EmailSettingsForm } from "@/features/settings/components/email-settings-form";
import { FeatureSettingsPanel } from "@/features/settings/components/feature-settings-panel";
import { TimezoneSettingsForm } from "@/features/settings/components/timezone-settings-form";
import { SETTINGS_LABELS } from "@/features/settings/constants";
import { PageHeader } from "@/shared/components/page-header";
import { PageLayout } from "@/shared/components/page-layout";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/shared/components/ui/tabs";

export const Route = createFileRoute("/_authed/settings")({
	component: SettingsPage,
});

const SETTINGS_TAB_VALUE = {
	EMAIL: "email",
	TIMEZONE: "timezone",
	COMMENTS: "comments",
	FEATURES: "features",
} as const;

function SettingsPage() {
	return (
		<PageLayout>
			<PageHeader
				title="Settings"
				description="Manage your application settings and configurations"
			/>

			<Tabs defaultValue={SETTINGS_TAB_VALUE.EMAIL} className="w-full">
				<TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 sm:mb-6 gap-2">
					<TabsTrigger
						value={SETTINGS_TAB_VALUE.EMAIL}
						className="flex items-center gap-2"
					>
						<Mail className="h-4 w-4" />
						<span className="hidden sm:inline">
							{SETTINGS_LABELS.EMAIL.TITLE}
						</span>
						<span className="sm:hidden">Email</span>
					</TabsTrigger>
					<TabsTrigger
						value={SETTINGS_TAB_VALUE.TIMEZONE}
						className="flex items-center gap-2"
					>
						<Clock className="h-4 w-4" />
						<span className="hidden sm:inline">
							{SETTINGS_LABELS.TIMEZONE.TITLE}
						</span>
						<span className="sm:hidden">Timezone</span>
					</TabsTrigger>
					<TabsTrigger
						value={SETTINGS_TAB_VALUE.COMMENTS}
						className="flex items-center gap-2"
					>
						<MessageSquare className="h-4 w-4" />
						<span className="hidden sm:inline">
							{SETTINGS_LABELS.COMMENTS.TITLE}
						</span>
						<span className="sm:hidden">Comments</span>
					</TabsTrigger>
					<TabsTrigger
						value={SETTINGS_TAB_VALUE.FEATURES}
						className="flex items-center gap-2"
					>
						<SettingsIcon className="h-4 w-4" />
						<span className="hidden sm:inline">
							{SETTINGS_LABELS.FEATURES.TITLE}
						</span>
						<span className="sm:hidden">Features</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value={SETTINGS_TAB_VALUE.EMAIL} className="mt-4 sm:mt-6">
					<div className="mb-4 sm:mb-6">
						<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
							<div className="p-2 sm:p-3 rounded-lg bg-primary/10">
								<Mail className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
							</div>
							<div>
								<h2 className="text-xl sm:text-2xl font-bold tracking-tight">
									{SETTINGS_LABELS.EMAIL.TITLE}
								</h2>
								<p className="text-sm sm:text-base text-muted-foreground mt-1">
									Configure SMTP settings for sending emails from your
									application
								</p>
							</div>
						</div>
					</div>
					<EmailSettingsForm />
				</TabsContent>

				<TabsContent
					value={SETTINGS_TAB_VALUE.TIMEZONE}
					className="mt-4 sm:mt-6"
				>
					<div className="mb-4 sm:mb-6">
						<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
							<div className="p-2 sm:p-3 rounded-lg bg-accent/10">
								<Clock className="h-6 w-6 sm:h-8 sm:w-8 text-accent-foreground" />
							</div>
							<div>
								<h2 className="text-xl sm:text-2xl font-bold tracking-tight">
									{SETTINGS_LABELS.TIMEZONE.TITLE}
								</h2>
								<p className="text-sm sm:text-base text-muted-foreground mt-1">
									Set the default timezone for your application
								</p>
							</div>
						</div>
					</div>
					<TimezoneSettingsForm />
				</TabsContent>

				<TabsContent
					value={SETTINGS_TAB_VALUE.COMMENTS}
					className="mt-4 sm:mt-6"
				>
					<div className="mb-4 sm:mb-6">
						<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
							<div className="p-2 sm:p-3 rounded-lg bg-primary/10">
								<MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
							</div>
							<div>
								<h2 className="text-xl sm:text-2xl font-bold tracking-tight">
									{SETTINGS_LABELS.COMMENTS.TITLE}
								</h2>
								<p className="text-sm sm:text-base text-muted-foreground mt-1">
									Configure comment moderation and approval settings
								</p>
							</div>
						</div>
					</div>
					<CommentSettingsForm />
				</TabsContent>

				<TabsContent
					value={SETTINGS_TAB_VALUE.FEATURES}
					className="mt-4 sm:mt-6"
				>
					<div className="mb-4 sm:mb-6">
						<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
							<div className="p-2 sm:p-3 rounded-lg bg-muted">
								<SettingsIcon className="h-6 w-6 sm:h-8 sm:w-8" />
							</div>
							<div>
								<h2 className="text-xl sm:text-2xl font-bold tracking-tight">
									{SETTINGS_LABELS.FEATURES.TITLE}
								</h2>
								<p className="text-sm sm:text-base text-muted-foreground mt-1">
									{SETTINGS_LABELS.FEATURES.DESCRIPTION}
								</p>
							</div>
						</div>
					</div>
					<FeatureSettingsPanel />
				</TabsContent>
			</Tabs>
		</PageLayout>
	);
}
