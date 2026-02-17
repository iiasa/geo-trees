import { useEffect, useId, useState } from "react";
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
import { useProfileData, useUpdateProfile } from "../hooks/use-profile-data";
import { useProfileFormStore } from "../stores/profile-form-store";
import { ProfileView } from "./profile-view";

export function ProfileForm() {
	const { profile, isLoading } = useProfileData();
	const updateProfile = useUpdateProfile();
	const userNameId = useId();
	const emailId = useId();
	const nameId = useId();
	const surnameId = useId();
	const phoneNumberId = useId();
	const [errors, setErrors] = useState<Record<string, string>>({});

	const {
		userName,
		email,
		name,
		surname,
		phoneNumber,
		isDirty,
		isEditing,
		setUserName,
		setEmail,
		setName,
		setSurname,
		setPhoneNumber,
		setIsEditing,
		initializeFromProfile,
		resetForm,
		markClean,
	} = useProfileFormStore();

	useEffect(() => {
		if (profile) {
			initializeFromProfile(profile);
		}
	}, [profile, initializeFromProfile]);

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		// Username validation
		if (!userName.trim()) {
			newErrors.userName = PROFILE_VALIDATION.USERNAME.REQUIRED;
		} else if (userName.length < PROFILE_FIELD_CONFIG.USERNAME.MIN_LENGTH) {
			newErrors.userName = PROFILE_VALIDATION.USERNAME.MIN_LENGTH;
		} else if (userName.length > PROFILE_FIELD_CONFIG.USERNAME.MAX_LENGTH) {
			newErrors.userName = PROFILE_VALIDATION.USERNAME.MAX_LENGTH;
		}

		// Email validation
		if (!email.trim()) {
			newErrors.email = PROFILE_VALIDATION.EMAIL.REQUIRED;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = PROFILE_VALIDATION.EMAIL.INVALID;
		}

		// Name validation (optional)
		if (name && name.length > PROFILE_FIELD_CONFIG.NAME.MAX_LENGTH) {
			newErrors.name = PROFILE_VALIDATION.NAME.MAX_LENGTH;
		}

		// Surname validation (optional)
		if (surname && surname.length > PROFILE_FIELD_CONFIG.SURNAME.MAX_LENGTH) {
			newErrors.surname = PROFILE_VALIDATION.SURNAME.MAX_LENGTH;
		}

		// Phone number validation (optional)
		if (phoneNumber && !/^[\d\s\-+()]+$/.test(phoneNumber)) {
			newErrors.phoneNumber = PROFILE_VALIDATION.PHONE_NUMBER.INVALID;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSave = async () => {
		if (!validateForm()) {
			return;
		}

		updateProfile.mutate(
			{
				body: {
					userName,
					email,
					name: name || null,
					surname: surname || null,
					phoneNumber: phoneNumber || null,
				},
			},
			{
				onSuccess: () => {
					markClean();
					setIsEditing(false);
				},
			},
		);
	};

	const handleCancel = () => {
		resetForm(profile);
		setErrors({});
		setIsEditing(false);
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{PROFILE_LABELS.GENERAL.TITLE}</CardTitle>
					<CardDescription>
						{PROFILE_LABELS.GENERAL.DESCRIPTION}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center py-8">
						<Spinner />
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!isEditing) {
		return <ProfileView onEdit={handleEdit} />;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{PROFILE_LABELS.GENERAL.TITLE}</CardTitle>
				<CardDescription>{PROFILE_LABELS.GENERAL.DESCRIPTION}</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSave();
					}}
					className="space-y-6"
				>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor={userNameId}>
								{PROFILE_LABELS.GENERAL.USERNAME}
								<span className="text-destructive ml-1">*</span>
							</Label>
							<Input
								id={userNameId}
								value={userName}
								onChange={(e) => setUserName(e.target.value)}
								placeholder="Enter username"
								disabled={updateProfile.isPending}
							/>
							{errors.userName && (
								<p className="text-sm text-destructive">{errors.userName}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor={emailId}>
								{PROFILE_LABELS.GENERAL.EMAIL}
								<span className="text-destructive ml-1">*</span>
							</Label>
							<Input
								id={emailId}
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter email address"
								disabled={updateProfile.isPending}
							/>
							{errors.email && (
								<p className="text-sm text-destructive">{errors.email}</p>
							)}
						</div>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor={nameId}>{PROFILE_LABELS.GENERAL.NAME}</Label>
							<Input
								id={nameId}
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Enter first name"
								disabled={updateProfile.isPending}
							/>
							{errors.name && (
								<p className="text-sm text-destructive">{errors.name}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor={surnameId}>
								{PROFILE_LABELS.GENERAL.SURNAME}
							</Label>
							<Input
								id={surnameId}
								value={surname}
								onChange={(e) => setSurname(e.target.value)}
								placeholder="Enter last name"
								disabled={updateProfile.isPending}
							/>
							{errors.surname && (
								<p className="text-sm text-destructive">{errors.surname}</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor={phoneNumberId}>
							{PROFILE_LABELS.GENERAL.PHONE_NUMBER}
						</Label>
						<Input
							id={phoneNumberId}
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
							placeholder="Enter phone number"
							disabled={updateProfile.isPending}
						/>
						{errors.phoneNumber && (
							<p className="text-sm text-destructive">{errors.phoneNumber}</p>
						)}
					</div>

					<div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={handleCancel}
							disabled={updateProfile.isPending}
							className="w-full sm:w-auto"
						>
							{PROFILE_LABELS.GENERAL.CANCEL}
						</Button>
						<Button
							type="submit"
							disabled={!isDirty || updateProfile.isPending}
							className="w-full sm:w-auto"
						>
							{updateProfile.isPending && <Spinner className="mr-2" />}
							{PROFILE_LABELS.GENERAL.SAVE}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
