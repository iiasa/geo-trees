import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { postApiAccountSendPasswordResetCodeMutation } from "@/infrastructure/api/@tanstack/react-query.gen";
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
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Spinner } from "@/shared/components/ui/spinner";
import {
	AUTH_ROUTES,
	FORGOT_PASSWORD_LABELS,
	PASSWORD_RESET_MESSAGES,
	PASSWORD_RESET_VALIDATION,
} from "../constants";

const DEFAULT_APP_NAME = "Geo Trees";

export function ForgotPasswordForm() {
	const emailId = useId();
	const [email, setEmail] = useState("");
	const [appName] = useState(DEFAULT_APP_NAME);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [success, setSuccess] = useState(false);

	const sendResetCode = useMutation({
		...postApiAccountSendPasswordResetCodeMutation(),
		onSuccess: () => {
			setSuccess(true);
			toast.success(PASSWORD_RESET_MESSAGES.SEND_CODE_SUCCESS);
		},
		onError: (error) => {
			console.error("Failed to send reset code:", error);
			toast.error(PASSWORD_RESET_MESSAGES.SEND_CODE_ERROR);
		},
	});

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!email.trim()) {
			newErrors.email = PASSWORD_RESET_VALIDATION.EMAIL.REQUIRED;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = PASSWORD_RESET_VALIDATION.EMAIL.INVALID;
		}

		if (!appName.trim()) {
			newErrors.appName = PASSWORD_RESET_VALIDATION.APP_NAME.REQUIRED;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		sendResetCode.mutate({
			body: {
				email,
				appName,
				returnUrl: window.location.origin + AUTH_ROUTES.RESET_PASSWORD,
			},
		});
	};

	if (success) {
		return (
			<Card className="w-full max-w-md mx-auto">
				<CardHeader>
					<div className="flex justify-center mb-4">
						<CheckCircle2 className="h-12 w-12 text-primary" />
					</div>
					<CardTitle className="text-center">
						{FORGOT_PASSWORD_LABELS.SUCCESS_TITLE}
					</CardTitle>
					<CardDescription className="text-center">
						{FORGOT_PASSWORD_LABELS.SUCCESS_MESSAGE}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Alert>
						<AlertTitle>What's next?</AlertTitle>
						<AlertDescription>
							Check your email inbox for a message with the password reset
							instructions. The email will contain a link to reset your
							password.
						</AlertDescription>
					</Alert>
					<div className="mt-6">
						<Link to={AUTH_ROUTES.LOGIN}>
							<Button variant="outline" className="w-full">
								<ArrowLeft className="h-4 w-4 mr-2" />
								{FORGOT_PASSWORD_LABELS.BACK_TO_LOGIN}
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle>{FORGOT_PASSWORD_LABELS.TITLE}</CardTitle>
				<CardDescription>{FORGOT_PASSWORD_LABELS.DESCRIPTION}</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor={emailId}>
							{FORGOT_PASSWORD_LABELS.EMAIL}
							<span className="text-destructive ml-1">*</span>
						</Label>
						<Input
							id={emailId}
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email address"
							disabled={sendResetCode.isPending}
						/>
						{errors.email && (
							<p className="text-sm text-destructive">{errors.email}</p>
						)}
					</div>

					<div className="flex flex-col gap-3">
						<Button
							type="submit"
							disabled={sendResetCode.isPending}
							className="w-full"
						>
							{sendResetCode.isPending && <Spinner className="mr-2" />}
							{FORGOT_PASSWORD_LABELS.SUBMIT}
						</Button>
						<Link to={AUTH_ROUTES.LOGIN}>
							<Button variant="outline" className="w-full">
								<ArrowLeft className="h-4 w-4 mr-2" />
								{FORGOT_PASSWORD_LABELS.BACK_TO_LOGIN}
							</Button>
						</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
