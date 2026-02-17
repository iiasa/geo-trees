import { useState, useEffect } from "react";
import { MapHeader } from "./map-header";
import { MapView } from "./map-view";
import { LayerPanel } from "./layer-panel";
import { MapLegend } from "./map-legend";
import { useMapLayers } from "../hooks/use-map-layers";
import { useMapStore } from "../stores/map-store";

export function MapPage() {
	const { layers, isLoading } = useMapLayers();
	const [panelOpen, setPanelOpen] = useState(true);
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
			{!isLoading && <MapView layers={layers} />}
			<LayerPanel
				layers={layers}
				isOpen={panelOpen}
				onToggle={() => setPanelOpen(!panelOpen)}
			/>
			<MapLegend layers={layers} />
		</div>
	);
}
