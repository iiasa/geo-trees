import { FeatureFlagsPanel } from "@/features/feature-flags/components/feature-flags-panel";
import { SETTINGS_LABELS } from "@/features/settings/constants";

export function FeatureSettingsPanel() {
	return (
		<FeatureFlagsPanel
			title={SETTINGS_LABELS.FEATURES.TITLE}
			description={SETTINGS_LABELS.FEATURES.DESCRIPTION}
			providerName="T"
			providerKey=""
			showProviderInputs={false}
		/>
	);
}
