import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { postApiAccountResetPasswordMutation } from "@/infrastructure/api/@tanstack/react-query.gen";
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
	PASSWORD_RESET_MESSAGES,
	PASSWORD_RESET_VALIDATION,
	RESET_PASSWORD_LABELS,
} from "../constants";

interface ResetPasswordFormProps {
	userId?: string;
	resetToken?: string;
}

const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

export function ResetPasswordForm({
	userId: initialUserId,
	resetToken: initialResetToken,
}: ResetPasswordFormProps) {
	const navigate = useNavigate();
	const userIdFieldId = useId();
	const resetTokenId = useId();
	const newPasswordId = useId();
	const confirmPasswordId = useId();
	const [userId, setUserId] = useState(initialUserId || "");
	const [resetToken, setResetToken] = useState(initialResetToken || "");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [success, setSuccess] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const resetPassword = useMutation({
		...postApiAccountResetPasswordMutation(),
		onSuccess: () => {
			setSuccess(true);
			toast.success(PASSWORD_RESET_MESSAGES.RESET_SUCCESS);
			setTimeout(() => {
				navigate({ to: AUTH_ROUTES.LOGIN });
			}, 3000);
		},
		onError: (error) => {
			console.error("Failed to reset password:", error);
			toast.error(PASSWORD_RESET_MESSAGES.RESET_ERROR);
		},
	});

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!userId.trim()) {
			newErrors.userId = PASSWORD_RESET_VALIDATION.USER_ID.REQUIRED;
		}

		if (!resetToken.trim()) {
			newErrors.resetToken = PASSWORD_RESET_VALIDATION.RESET_TOKEN.REQUIRED;
		}

		if (!newPassword) {
			newErrors.newPassword = PASSWORD_RESET_VALIDATION.PASSWORD.REQUIRED;
		} else if (newPassword.length < PASSWORD_MIN_LENGTH) {
			newErrors.newPassword = PASSWORD_RESET_VALIDATION.PASSWORD.MIN_LENGTH;
		} else if (!PASSWORD_REGEX.test(newPassword)) {
			newErrors.newPassword = PASSWORD_RESET_VALIDATION.PASSWORD.COMPLEXITY;
		}

		if (!confirmPassword) {
			newErrors.confirmPassword =
				PASSWORD_RESET_VALIDATION.PASSWORD.CONFIRM_REQUIRED;
		} else if (confirmPassword !== newPassword) {
			newErrors.confirmPassword = PASSWORD_RESET_VALIDATION.PASSWORD.MISMATCH;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		resetPassword.mutate({
			body: {
				userId,
				resetToken,
				password: newPassword,
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
						{RESET_PASSWORD_LABELS.SUCCESS_TITLE}
					</CardTitle>
					<CardDescription className="text-center">
						{RESET_PASSWORD_LABELS.SUCCESS_MESSAGE}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Alert>
						<AlertTitle>Redirecting...</AlertTitle>
						<AlertDescription>
							You will be redirected to the login page shortly.
						</AlertDescription>
					</Alert>
					<div className="mt-6">
						<Link to={AUTH_ROUTES.LOGIN}>
							<Button className="w-full">Go to Login</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle>{RESET_PASSWORD_LABELS.TITLE}</CardTitle>
				<CardDescription>{RESET_PASSWORD_LABELS.DESCRIPTION}</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor={userIdFieldId}>
							{RESET_PASSWORD_LABELS.USER_ID}
							<span className="text-destructive ml-1">*</span>
						</Label>
						<Input
							id={userIdFieldId}
							value={userId}
							onChange={(e) => setUserId(e.target.value)}
							placeholder="Enter user ID"
							disabled={resetPassword.isPending || !!initialUserId}
						/>
						{errors.userId && (
							<p className="text-sm text-destructive">{errors.userId}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor={resetTokenId}>
							{RESET_PASSWORD_LABELS.RESET_TOKEN}
							<span className="text-destructive ml-1">*</span>
						</Label>
						<Input
							id={resetTokenId}
							value={resetToken}
							onChange={(e) => setResetToken(e.target.value)}
							placeholder="Enter reset token"
							disabled={resetPassword.isPending || !!initialResetToken}
						/>
						{errors.resetToken && (
							<p className="text-sm text-destructive">{errors.resetToken}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor={newPasswordId}>
							{RESET_PASSWORD_LABELS.NEW_PASSWORD}
							<span className="text-destructive ml-1">*</span>
						</Label>
						<div className="relative">
							<Input
								id={newPasswordId}
								type={showNewPassword ? "text" : "password"}
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								placeholder="Enter new password"
								disabled={resetPassword.isPending}
							/>
							<button
								type="button"
								onClick={() => setShowNewPassword(!showNewPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								{showNewPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>
						{errors.newPassword && (
							<p className="text-sm text-destructive">{errors.newPassword}</p>
						)}
						<p className="text-xs text-muted-foreground">
							Password must be at least 6 characters and contain uppercase,
							lowercase, and number
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor={confirmPasswordId}>
							{RESET_PASSWORD_LABELS.CONFIRM_PASSWORD}
							<span className="text-destructive ml-1">*</span>
						</Label>
						<div className="relative">
							<Input
								id={confirmPasswordId}
								type={showConfirmPassword ? "text" : "password"}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="Confirm new password"
								disabled={resetPassword.isPending}
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								{showConfirmPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>
						{errors.confirmPassword && (
							<p className="text-sm text-destructive">
								{errors.confirmPassword}
							</p>
						)}
					</div>

					<Button
						type="submit"
						disabled={resetPassword.isPending}
						className="w-full"
					>
						{resetPassword.isPending && <Spinner className="mr-2" />}
						{RESET_PASSWORD_LABELS.SUBMIT}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
