import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const Route = createFileRoute("/auth/reset-password")({
	component: ResetPasswordPage,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			userId: (search.userId as string) || undefined,
			resetToken: (search.resetToken as string) || undefined,
		};
	},
});

function ResetPasswordPage() {
	const { userId, resetToken } = Route.useSearch();

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<ResetPasswordForm userId={userId} resetToken={resetToken} />
		</div>
	);
}
