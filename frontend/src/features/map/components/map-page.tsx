import { useState, useEffect } from "react";
import type maplibregl from "maplibre-gl";
import { Download } from "lucide-react";
import { BasemapSwitcher } from "./basemap-switcher";
import { MapHeader } from "./map-header";
import { MapView } from "./map-view";
import { LayerPanel } from "./layer-panel";
import { MapLegend } from "./map-legend";
import { BrmLayer } from "./brm-layer";
import { BrmPopup } from "./brm-popup";
import { StatusLegend } from "./status-legend";
import { DownloadPanel } from "./download-panel";
import { useMapLayers } from "../hooks/use-map-layers";
import { useMapStore } from "../stores/map-store";

export function MapPage() {
	const { layers, isLoading } = useMapLayers();
	const [panelOpen, setPanelOpen] = useState(true);
	const [downloadOpen, setDownloadOpen] = useState(false);
	const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
	const { setLayerVisibility, layerVisibility } = useMapStore();

	const brmVisible = layerVisibility["brm-sites"] ?? true;

	useEffect(() => {
		if (layers.length > 0) {
			const initial: Record<string, boolean> = { "brm-sites": true };
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
			<BrmLayer map={mapInstance} visible={brmVisible} />
			<BrmPopup map={mapInstance} pointLayerId="brm-points" />
			<LayerPanel
				layers={layers}
				isOpen={panelOpen}
				onToggle={() => setPanelOpen(!panelOpen)}
			/>
			<BasemapSwitcher />

			{/* Download button */}
			<div className="absolute bottom-24 right-4 z-10">
				<button
					type="button"
					onClick={() => setDownloadOpen(!downloadOpen)}
					className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 shadow-lg p-2.5 hover:bg-gray-50 transition-colors"
				>
					<Download className="size-4 text-gray-700" />
				</button>
				{downloadOpen && (
					<div className="absolute bottom-12 right-0">
						<DownloadPanel />
					</div>
				)}
			</div>

			{/* Status legend */}
			<div className="absolute bottom-8 right-4 z-10">
				<StatusLegend visible={brmVisible} />
			</div>

			<MapLegend layers={layers} />
		</div>
	);
}
