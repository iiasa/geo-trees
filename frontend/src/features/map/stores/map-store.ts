import type { Feature } from "geojson";
import { create } from "zustand";
import type { BasemapId } from "../constants";
import { MAP_DEFAULTS } from "../constants";

interface MapState {
	layerVisibility: Record<string, boolean>;
	selectedFeature: Feature | null;
	layerOpacity: Record<string, number>;
	activeBasemap: BasemapId;
	toggleLayer: (layerId: string) => void;
	setLayerVisibility: (visibility: Record<string, boolean>) => void;
	setSelectedFeature: (feature: Feature | null) => void;
	setLayerOpacity: (layerId: string, opacity: number) => void;
	setActiveBasemap: (basemap: BasemapId) => void;
}

export const useMapStore = create<MapState>((set) => ({
	layerVisibility: {},
	selectedFeature: null,
	layerOpacity: {},
	activeBasemap: MAP_DEFAULTS.STYLE as BasemapId,
	toggleLayer: (layerId) =>
		set((state) => ({
			layerVisibility: {
				...state.layerVisibility,
				[layerId]: !state.layerVisibility[layerId],
			},
		})),
	setLayerVisibility: (visibility) => set({ layerVisibility: visibility }),
	setLayerOpacity: (layerId, opacity) =>
		set((state) => ({
			layerOpacity: {
				...state.layerOpacity,
				[layerId]: opacity,
			},
		})),
	setSelectedFeature: (feature) => set({ selectedFeature: feature }),
	setActiveBasemap: (basemap) => set({ activeBasemap: basemap }),
}));
