import { createFileRoute } from "@tanstack/react-router";
import { ChangePasswordForm } from "@/features/profile/components/change-password-form";

export const Route = createFileRoute("/_authed/profile/security")({
	component: SecurityPage,
});

function SecurityPage() {
	return <ChangePasswordForm />;
}
