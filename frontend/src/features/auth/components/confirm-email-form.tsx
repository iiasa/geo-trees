import { Link } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Spinner } from "@/shared/components/ui/spinner";
import { AUTH_ROUTES } from "../constants";

interface ConfirmEmailFormProps {
	userId?: string;
	confirmationToken?: string;
}

type ConfirmState = "loading" | "success" | "error";

export function ConfirmEmailForm({
	userId,
	confirmationToken,
}: ConfirmEmailFormProps) {
	const [state, setState] = useState<ConfirmState>("loading");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		if (!userId || !confirmationToken) {
			setState("error");
			setErrorMessage(
				"Invalid confirmation link. Missing required parameters.",
			);
			return;
		}

		const confirm = async () => {
			try {
				const res = await fetch(
					"/api/proxy/api/app/email-confirmation/confirm",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ userId, token: confirmationToken }),
					},
				);

				if (!res.ok) {
					const data = await res.json().catch(() => null);
					throw new Error(
						data?.error?.message ||
							"Email confirmation failed. The link may have expired.",
					);
				}

				setState("success");
			} catch (err) {
				setState("error");
				setErrorMessage(
					err instanceof Error ? err.message : "An unexpected error occurred.",
				);
			}
		};

		confirm();
	}, [userId, confirmationToken]);

	if (state === "loading") {
		return (
			<Card className="w-full max-w-md mx-auto">
				<CardHeader>
					<CardTitle className="text-center">Verifying Email</CardTitle>
					<CardDescription className="text-center">
						Please wait while we confirm your email address...
					</CardDescription>
				</CardHeader>
				<CardContent className="flex justify-center py-8">
					<Spinner className="h-8 w-8" />
				</CardContent>
			</Card>
		);
	}

	if (state === "success") {
		return (
			<Card className="w-full max-w-md mx-auto">
				<CardHeader>
					<div className="flex justify-center mb-4">
						<CheckCircle2 className="h-12 w-12 text-primary" />
					</div>
					<CardTitle className="text-center">Email Confirmed</CardTitle>
					<CardDescription className="text-center">
						Your email address has been verified successfully.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Alert>
						<AlertTitle>You're all set!</AlertTitle>
						<AlertDescription>
							You can now sign in to your account.
						</AlertDescription>
					</Alert>
					<div className="mt-6">
						<Link to={AUTH_ROUTES.LOGIN}>
							<Button className="w-full">Sign In</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<div className="flex justify-center mb-4">
					<AlertCircle className="h-12 w-12 text-destructive" />
				</div>
				<CardTitle className="text-center">Confirmation Failed</CardTitle>
				<CardDescription className="text-center">
					We couldn't verify your email address.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Alert variant="destructive">
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{errorMessage}</AlertDescription>
				</Alert>
				<div className="mt-6 space-y-3">
					{userId && confirmationToken && (
						<Button
							className="w-full"
							onClick={() => {
								setState("loading");
								setErrorMessage("");
								window.location.reload();
							}}
						>
							Try Again
						</Button>
					)}
					<Link to={AUTH_ROUTES.LOGIN}>
						<Button variant="outline" className="w-full">
							Go to Login
						</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
