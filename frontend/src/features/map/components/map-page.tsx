import { useState, useEffect } from "react";
import type maplibregl from "maplibre-gl";
import { MapHeader } from "./map-header";
import { MapView } from "./map-view";
import { MapControls } from "./map-controls";
import { MapControlContainer } from "./map-control-container";
import { useMapLayers } from "../hooks/use-map-layers";
import { useMapStore } from "../stores/map-store";

export function MapPage() {
	const { layers, isLoading } = useMapLayers();
	const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
	const { setLayerVisibility } = useMapStore();

	useEffect(() => {
		if (layers.length > 0) {
			const initial: Record<string, boolean> = {};
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
			<MapControls map={mapInstance} />
			<MapControlContainer />
		</div>
	);
}
