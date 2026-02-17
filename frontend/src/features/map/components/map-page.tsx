import { useState, useEffect } from "react";
import type maplibregl from "maplibre-gl";
import { MapHeader } from "./map-header";
import { MapView } from "./map-view";
import { BrmLayer } from "./brm-layer";
import { BrmPopup } from "./brm-popup";
import { AlsLayer } from "./als-layer";
import { MapControls } from "./map-controls";
import { MapControlContainer } from "./map-control-container";
import { useMapLayers } from "../hooks/use-map-layers";
import { useMapStore } from "../stores/map-store";

export function MapPage() {
	const { layers, isLoading } = useMapLayers();
	const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
	const { setLayerVisibility, layerVisibility, activeBasemap } = useMapStore();

	const brmVisible = layerVisibility["brm-sites"] ?? true;
	const alsVisible = layerVisibility["als-data"] ?? false;

	useEffect(() => {
		if (layers.length > 0) {
			const initial: Record<string, boolean> = {
				"brm-sites": true,
				"als-data": false,
			};
			for (const layer of layers) {
				if (layer.id) {
					initial[layer.id] = layer.isVisible ?? false;
				}
			}
			setLayerVisibility(initial);
		}
	}, [layers, setLayerVisibility]);

	return (
		<div className="relative w-screen h-screen overflow-hidden">
			<MapHeader />
			{!isLoading && <MapView layers={layers} onMapReady={setMapInstance} />}
			<BrmLayer
				key={`brm-${activeBasemap}`}
				map={mapInstance}
				visible={brmVisible}
			/>
			<BrmPopup
				key={`brm-popup-${activeBasemap}`}
				map={mapInstance}
				pointLayerId="brm-points"
			/>
			<AlsLayer
				key={`als-${activeBasemap}`}
				map={mapInstance}
				visible={alsVisible}
			/>
			<MapControls map={mapInstance} />
			<MapControlContainer />
		</div>
	);
}
