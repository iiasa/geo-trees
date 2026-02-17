import { Checkbox } from "@/shared/components/ui/checkbox";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import {
	getPermissionGroupDisplayName,
	getPermissionDisplayName,
} from "@/features/roles/hooks/permission-utils";
import type { PermissionGrantInfoDto } from "@/infrastructure/api/types.gen";

interface PermissionGroupProps {
	groupName: string;
	permissions: PermissionGrantInfoDto[];
	onPermissionChange: (permissionName: string, isGranted: boolean) => void;
	onGroupChange: (groupName: string, isGranted: boolean) => void;
}

export function PermissionGroup({
	groupName,
	permissions,
	onPermissionChange,
	onGroupChange,
}: PermissionGroupProps) {
	// Calculate how many permissions in this group are granted
	const grantedCount = permissions.filter((p) => p.isGranted).length;
	const totalCount = permissions.length;
	const isAllGranted = grantedCount === totalCount && totalCount > 0;
	const isPartiallyGranted = grantedCount > 0 && grantedCount < totalCount;

	const handleGroupChange = (checked: boolean) => {
		onGroupChange(groupName, checked);
	};

	return (
		<Card className="w-full">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">
						{getPermissionGroupDisplayName(groupName)}
					</CardTitle>
					<div className="flex items-center space-x-2">
						<Badge variant="secondary">
							{grantedCount}/{totalCount}
						</Badge>
						<Checkbox
							checked={isAllGranted}
							ref={(ref) => {
								if (ref && "indeterminate" in ref) {
									// Handle indeterminate state for partial selection
									(ref as HTMLInputElement).indeterminate = isPartiallyGranted;
								}
							}}
							onCheckedChange={handleGroupChange}
							aria-label={`Toggle all permissions in ${getPermissionGroupDisplayName(
								groupName,
							)}`}
						/>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-2">
				{permissions.map((permission, index) => {
					if (!permission.name) return null;

					return (
						<div key={permission.name}>
							<div className="flex items-center space-x-2 py-1">
								<Checkbox
									id={permission.name}
									checked={permission.isGranted || false}
									onCheckedChange={(checked) =>
										permission.name &&
										onPermissionChange(permission.name, checked as boolean)
									}
								/>
								<label
									htmlFor={permission.name}
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
								>
									{getPermissionDisplayName(permission.name)}
								</label>
							</div>
							{index < permissions.length - 1 && <Separator className="my-1" />}
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
