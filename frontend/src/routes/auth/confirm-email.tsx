import { createFileRoute } from "@tanstack/react-router";
import { ConfirmEmailForm } from "@/features/auth/components/confirm-email-form";

export const Route = createFileRoute("/auth/confirm-email")({
	component: ConfirmEmailPage,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			userId: (search.userId as string) || undefined,
			confirmationToken: (search.confirmationToken as string) || undefined,
		};
	},
});

function ConfirmEmailPage() {
	const { userId, confirmationToken } = Route.useSearch();

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<ConfirmEmailForm userId={userId} confirmationToken={confirmationToken} />
		</div>
	);
}
