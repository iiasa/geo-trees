import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/shared/components/ui/dialog";
import type { TenantDto } from "@/infrastructure/api/types.gen";
import { FeatureFlagsPanel } from "@/features/feature-flags/components/feature-flags-panel";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

type TenantFeaturesModalProps = {
	tenant?: TenantDto;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function TenantFeaturesModal({
	tenant,
	open,
	onOpenChange,
}: TenantFeaturesModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-5xl">
				<DialogHeader>
					<DialogTitle>
						{tenant ? `Features for ${tenant.name}` : "Tenant Features"}
					</DialogTitle>
				</DialogHeader>
				{tenant ? (
					<ScrollArea className="max-h-[70vh] pr-4">
						<div className="pb-4">
							<FeatureFlagsPanel
								providerName="T"
								providerKey={tenant.id ?? ""}
								title={`Tenant: ${tenant.name ?? tenant.id ?? "Unknown"}`}
								description="Manage feature flags for this tenant"
								showProviderInputs={false}
							/>
						</div>
					</ScrollArea>
				) : null}
			</DialogContent>
		</Dialog>
	);
}
