import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { postApiAccountRegisterMutation } from "@/infrastructure/api/@tanstack/react-query.gen";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Spinner } from "@/shared/components/ui/spinner";
import {
	AUTH_ROUTES,
	REGISTER_LABELS,
	REGISTER_MESSAGES,
	REGISTER_VALIDATION,
} from "../constants";

const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

export function RegisterForm() {
	const userNameId = useId();
	const emailId = useId();
	const passwordId = useId();
	const confirmPasswordId = useId();
	const institutionId = useId();
	const countryId = useId();
	const termsId = useId();

	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [institution, setInstitution] = useState("");
	const [country, setCountry] = useState("");
	const [acceptTerms, setAcceptTerms] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [success, setSuccess] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { data: registrationSettings } = useQuery({
		queryKey: ["registration-settings"],
		queryFn: async () => {
			const response = await fetch("/api/proxy/api/app/registration-settings");
			if (!response.ok) return { termsAndConditionsUrl: "" };
			return response.json();
		},
	});
	const termsUrl = registrationSettings?.termsAndConditionsUrl || "";

	const register = useMutation({
		...postApiAccountRegisterMutation(),
		onSuccess: () => {
			setSuccess(true);
			toast.success(REGISTER_MESSAGES.SUCCESS);
		},
		onError: (error) => {
			console.error("Registration failed:", error);
			toast.error(REGISTER_MESSAGES.ERROR);
		},
	});

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!userName.trim()) {
			newErrors.userName = REGISTER_VALIDATION.USERNAME.REQUIRED;
		}

		if (!email.trim()) {
			newErrors.email = REGISTER_VALIDATION.EMAIL.REQUIRED;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = REGISTER_VALIDATION.EMAIL.INVALID;
		}

		if (!password) {
			newErrors.password = REGISTER_VALIDATION.PASSWORD.REQUIRED;
		} else if (password.length < PASSWORD_MIN_LENGTH) {
			newErrors.password = REGISTER_VALIDATION.PASSWORD.MIN_LENGTH;
		} else if (!PASSWORD_REGEX.test(password)) {
			newErrors.password = REGISTER_VALIDATION.PASSWORD.COMPLEXITY;
		}

		if (!confirmPassword) {
			newErrors.confirmPassword = REGISTER_VALIDATION.PASSWORD.CONFIRM_REQUIRED;
		} else if (confirmPassword !== password) {
			newErrors.confirmPassword = REGISTER_VALIDATION.PASSWORD.MISMATCH;
		}

		if (!institution.trim()) {
			newErrors.institution = REGISTER_VALIDATION.INSTITUTION.REQUIRED;
		}

		if (!country.trim()) {
			newErrors.country = REGISTER_VALIDATION.COUNTRY.REQUIRED;
		}

		if (!acceptTerms) {
			newErrors.acceptTerms = REGISTER_VALIDATION.TERMS.REQUIRED;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		register.mutate({
			body: {
				userName,
				emailAddress: email,
				password,
				appName: "Geo Trees",
				extraProperties: {
					Institution: institution,
					Country: country,
				},
			} as Record<string, unknown>,
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
						{REGISTER_LABELS.SUCCESS_TITLE}
					</CardTitle>
					<CardDescription className="text-center">
						{REGISTER_LABELS.SUCCESS_MESSAGE}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Link to={AUTH_ROUTES.LOGIN}>
						<Button className="w-full">
							<ArrowLeft className="h-4 w-4 mr-2" />
							{REGISTER_LABELS.SIGN_IN}
						</Button>
					</Link>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle>{REGISTER_LABELS.TITLE}</CardTitle>
				<CardDescription>{REGISTER_LABELS.DESCRIPTION}</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor={userNameId}>
							{REGISTER_LABELS.USERNAME}
							<span className="text-destructive ml-1">*</span>
						</Label>
						<Input
							id={userNameId}
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
							placeholder="Enter your username"
							disabled={register.isPending}
						/>
						{errors.userName && (
							<p className="text-sm text-destructive">{errors.userName}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor={emailId}>
							{REGISTER_LABELS.EMAIL}
							<span className="text-destructive ml-1">*</span>
						</Label>
						<Input
							id={emailId}
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email address"
							disabled={register.isPending}
						/>
						{errors.email && (
							<p className="text-sm text-destructive">{errors.email}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor={passwordId}>
							{REGISTER_LABELS.PASSWORD}
							<span className="text-destructive ml-1">*</span>
						</Label>
						<div className="relative">
							<Input
								id={passwordId}
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
								disabled={register.isPending}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>
						{errors.password && (
							<p className="text-sm text-destructive">{errors.password}</p>
						)}
						<p className="text-xs text-muted-foreground">
							Password must be at least 6 characters and contain uppercase,
							lowercase, and number
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor={confirmPasswordId}>
							{REGISTER_LABELS.CONFIRM_PASSWORD}
							<span className="text-destructive ml-1">*</span>
						</Label>
						<div className="relative">
							<Input
								id={confirmPasswordId}
								type={showConfirmPassword ? "text" : "password"}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="Confirm your password"
								disabled={register.isPending}
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

					<div className="space-y-2">
						<Label htmlFor={institutionId}>
							{REGISTER_LABELS.INSTITUTION}
							<span className="text-destructive ml-1">*</span>
						</Label>
						<Input
							id={institutionId}
							value={institution}
							onChange={(e) => setInstitution(e.target.value)}
							placeholder="Enter your institution"
							disabled={register.isPending}
						/>
						{errors.institution && (
							<p className="text-sm text-destructive">{errors.institution}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor={countryId}>
							{REGISTER_LABELS.COUNTRY}
							<span className="text-destructive ml-1">*</span>
						</Label>
						<Input
							id={countryId}
							value={country}
							onChange={(e) => setCountry(e.target.value)}
							placeholder="Enter your country"
							disabled={register.isPending}
						/>
						{errors.country && (
							<p className="text-sm text-destructive">{errors.country}</p>
						)}
					</div>

					<div className="space-y-2">
						<div className="flex items-start space-x-2">
							<Checkbox
								id={termsId}
								checked={acceptTerms}
								onCheckedChange={(checked) => setAcceptTerms(checked === true)}
								disabled={register.isPending}
							/>
							<Label
								htmlFor={termsId}
								className="text-sm font-normal leading-snug"
							>
								{REGISTER_LABELS.TERMS}{" "}
								{termsUrl ? (
									<a
										href={termsUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="text-primary hover:underline"
									>
										{REGISTER_LABELS.TERMS_LINK}
									</a>
								) : (
									REGISTER_LABELS.TERMS_LINK
								)}
							</Label>
						</div>
						{errors.acceptTerms && (
							<p className="text-sm text-destructive">{errors.acceptTerms}</p>
						)}
					</div>

					<div className="flex flex-col gap-3">
						<Button
							type="submit"
							disabled={register.isPending}
							className="w-full"
						>
							{register.isPending && <Spinner className="mr-2" />}
							{REGISTER_LABELS.SUBMIT}
						</Button>
						<p className="text-center text-sm text-muted-foreground">
							{REGISTER_LABELS.ALREADY_HAVE_ACCOUNT}{" "}
							<Link
								to={AUTH_ROUTES.LOGIN}
								className="text-primary hover:underline"
							>
								{REGISTER_LABELS.SIGN_IN}
							</Link>
						</p>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
