import type { Feature } from "geojson";
import { create } from "zustand";

interface MapState {
	layerVisibility: Record<string, boolean>;
	selectedFeature: Feature | null;
	toggleLayer: (layerId: string) => void;
	setLayerVisibility: (visibility: Record<string, boolean>) => void;
	setSelectedFeature: (feature: Feature | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
	layerVisibility: {},
	selectedFeature: null,
	toggleLayer: (layerId) =>
		set((state) => ({
			layerVisibility: {
				...state.layerVisibility,
				[layerId]: !state.layerVisibility[layerId],
			},
		})),
	setLayerVisibility: (visibility) => set({ layerVisibility: visibility }),
	setSelectedFeature: (feature) => set({ selectedFeature: feature }),
}));
