import { create } from "zustand";
import type {
	FeatureDto,
	FeatureGroupDto,
} from "@/infrastructure/api/types.gen";

const normalize = (value?: string | null) => value?.toLowerCase() ?? "";

const filterFeatures = (features: FeatureDto[], term: string) => {
	if (!term.trim()) return features;
	const needle = normalize(term);
	return features.filter((feature) => {
		const name = normalize(feature.name);
		const display = normalize(feature.displayName);
		const description = normalize(feature.description);
		return (
			name.includes(needle) ||
			display.includes(needle) ||
			description.includes(needle)
		);
	});
};

type FeatureFlagsState = {
	groups: FeatureGroupDto[];
	features: FeatureDto[];
	filteredFeatures: FeatureDto[];
	searchTerm: string;
	providerName: string;
	providerKey: string;
};

type FeatureFlagsActions = {
	setFromApi: (groups: FeatureGroupDto[]) => void;
	setSearchTerm: (term: string) => void;
	updateFeatureValue: (name: string, value: string) => void;
	setProviderName: (name: string) => void;
	setProviderKey: (key: string) => void;
	reset: () => void;
};

type FeatureFlagsStore = FeatureFlagsState & FeatureFlagsActions;

const initialState: FeatureFlagsState = {
	groups: [],
	features: [],
	filteredFeatures: [],
	searchTerm: "",
	providerName: "",
	providerKey: "",
};

export const useFeatureFlagsStore = create<FeatureFlagsStore>((set, get) => ({
	...initialState,
	setFromApi: (groups) => {
		const flattened: FeatureDto[] = [];
		groups.forEach((group) => {
			group.features?.forEach((feature) => {
				flattened.push(feature);
			});
		});

		const { searchTerm } = get();
		const filtered = filterFeatures(flattened, searchTerm);

		set({
			groups,
			features: flattened,
			filteredFeatures: filtered,
		});
	},
	setSearchTerm: (term) => {
		const { features } = get();
		set({
			searchTerm: term,
			filteredFeatures: filterFeatures(features, term),
		});
	},
	updateFeatureValue: (name, value) => {
		const { features, searchTerm } = get();
		const updated = features.map((feature) =>
			feature.name === name ? { ...feature, value } : feature,
		);
		set({
			features: updated,
			filteredFeatures: filterFeatures(updated, searchTerm),
		});
	},
	setProviderName: (name) => set({ providerName: name }),
	setProviderKey: (key) => set({ providerKey: key }),
	reset: () => set(initialState),
}));
