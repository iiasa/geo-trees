import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const Route = createFileRoute("/auth/forgot-password")({
	component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<ForgotPasswordForm />
		</div>
	);
}
