import { Mail, Phone, User, UserCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Spinner } from "@/shared/components/ui/spinner";
import { PROFILE_LABELS } from "../constants";
import { useProfileData } from "../hooks/use-profile-data";

interface ProfileViewProps {
	onEdit: () => void;
}

export function ProfileView({ onEdit }: ProfileViewProps) {
	const { profile, isLoading } = useProfileData();

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{PROFILE_LABELS.GENERAL.TITLE}</CardTitle>
					<CardDescription>
						{PROFILE_LABELS.GENERAL.DESCRIPTION}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center py-8">
						<Spinner />
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!profile) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{PROFILE_LABELS.GENERAL.TITLE}</CardTitle>
					<CardDescription>
						{PROFILE_LABELS.GENERAL.DESCRIPTION}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">No profile data available</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>{PROFILE_LABELS.GENERAL.TITLE}</CardTitle>
						<CardDescription>
							{PROFILE_LABELS.GENERAL.DESCRIPTION}
						</CardDescription>
					</div>
					<Button onClick={onEdit}>{PROFILE_LABELS.GENERAL.EDIT}</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					<div className="grid gap-6 md:grid-cols-2">
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<UserCircle className="h-4 w-4" />
								<span>{PROFILE_LABELS.GENERAL.USERNAME}</span>
							</div>
							<p className="text-base font-medium">{profile.userName || "-"}</p>
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Mail className="h-4 w-4" />
								<span>{PROFILE_LABELS.GENERAL.EMAIL}</span>
							</div>
							<p className="text-base font-medium">{profile.email || "-"}</p>
						</div>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<User className="h-4 w-4" />
								<span>{PROFILE_LABELS.GENERAL.NAME}</span>
							</div>
							<p className="text-base font-medium">{profile.name || "-"}</p>
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<User className="h-4 w-4" />
								<span>{PROFILE_LABELS.GENERAL.SURNAME}</span>
							</div>
							<p className="text-base font-medium">{profile.surname || "-"}</p>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Phone className="h-4 w-4" />
							<span>{PROFILE_LABELS.GENERAL.PHONE_NUMBER}</span>
						</div>
						<p className="text-base font-medium">
							{profile.phoneNumber || "-"}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
