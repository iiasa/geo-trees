import { PageHeader } from "@/shared/components/page-header";
import { PageLayout } from "@/shared/components/page-layout";
import { FeatureFlagsPanel } from "@/features/feature-flags/components/feature-flags-panel";

export function FeatureFlagsPage() {
	return (
		<PageLayout>
			<PageHeader title="Feature Flags" description="Manage feature flags" />
			<FeatureFlagsPanel showProviderInputs />
		</PageLayout>
	);
}
