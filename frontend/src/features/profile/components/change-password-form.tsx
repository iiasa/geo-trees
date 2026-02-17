import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
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
	PROFILE_FIELD_CONFIG,
	PROFILE_LABELS,
	PROFILE_VALIDATION,
} from "../constants";
import { useChangePassword } from "../hooks/use-profile-data";

export function ChangePasswordForm() {
	const changePassword = useChangePassword();
	const currentPasswordId = useId();
	const newPasswordId = useId();
	const confirmPasswordId = useId();
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		// Current password validation
		if (!currentPassword) {
			newErrors.currentPassword = PROFILE_VALIDATION.PASSWORD.CURRENT_REQUIRED;
		}

		// New password validation
		if (!newPassword) {
			newErrors.newPassword = PROFILE_VALIDATION.PASSWORD.NEW_REQUIRED;
		} else if (newPassword.length < PROFILE_FIELD_CONFIG.PASSWORD.MIN_LENGTH) {
			newErrors.newPassword = PROFILE_VALIDATION.PASSWORD.MIN_LENGTH;
		} else if (!PROFILE_FIELD_CONFIG.PASSWORD.REGEX.test(newPassword)) {
			newErrors.newPassword = PROFILE_VALIDATION.PASSWORD.COMPLEXITY;
		}

		// Confirm password validation
		if (!confirmPassword) {
			newErrors.confirmPassword = PROFILE_VALIDATION.PASSWORD.CONFIRM_REQUIRED;
		} else if (confirmPassword !== newPassword) {
			newErrors.confirmPassword = PROFILE_VALIDATION.PASSWORD.MISMATCH;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		changePassword.mutate(
			{
				body: {
					currentPassword,
					newPassword,
				},
			},
			{
				onSuccess: () => {
					// Reset form on success
					setCurrentPassword("");
					setNewPassword("");
					setConfirmPassword("");
					setErrors({});
				},
			},
		);
	};

	const handleCancel = () => {
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
		setErrors({});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{PROFILE_LABELS.SECURITY.TITLE}</CardTitle>
				<CardDescription>{PROFILE_LABELS.SECURITY.DESCRIPTION}</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor={currentPasswordId}>
							{PROFILE_LABELS.SECURITY.CURRENT_PASSWORD}
							<span className="text-destructive ml-1">*</span>
						</Label>
						<div className="relative">
							<Input
								id={currentPasswordId}
								type={showCurrentPassword ? "text" : "password"}
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								placeholder="Enter current password"
								disabled={changePassword.isPending}
							/>
							<button
								type="button"
								onClick={() => setShowCurrentPassword(!showCurrentPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								{showCurrentPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>
						{errors.currentPassword && (
							<p className="text-sm text-destructive">
								{errors.currentPassword}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor={newPasswordId}>
							{PROFILE_LABELS.SECURITY.NEW_PASSWORD}
							<span className="text-destructive ml-1">*</span>
						</Label>
						<div className="relative">
							<Input
								id={newPasswordId}
								type={showNewPassword ? "text" : "password"}
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								placeholder="Enter new password"
								disabled={changePassword.isPending}
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
							{PROFILE_LABELS.SECURITY.CONFIRM_PASSWORD}
							<span className="text-destructive ml-1">*</span>
						</Label>
						<div className="relative">
							<Input
								id={confirmPasswordId}
								type={showConfirmPassword ? "text" : "password"}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="Confirm new password"
								disabled={changePassword.isPending}
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

					<div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={handleCancel}
							disabled={changePassword.isPending}
							className="w-full sm:w-auto"
						>
							{PROFILE_LABELS.SECURITY.CANCEL}
						</Button>
						<Button
							type="submit"
							disabled={changePassword.isPending}
							className="w-full sm:w-auto"
						>
							{changePassword.isPending && <Spinner className="mr-2" />}
							{PROFILE_LABELS.SECURITY.SAVE}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
