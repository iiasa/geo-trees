import { createFileRoute } from "@tanstack/react-router";
import { ProfileForm } from "@/features/profile/components/profile-form";

export const Route = createFileRoute("/_authed/profile/")({
	component: ProfilePage,
});

function ProfilePage() {
	return <ProfileForm />;
}
