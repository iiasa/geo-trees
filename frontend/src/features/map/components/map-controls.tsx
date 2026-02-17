import { useEffect } from "react";
import { BookOpen, Download, Layers, Map, Minus, Plus } from "lucide-react";
import { useMapControlsStore } from "../stores/map-controls-store";
import { BasemapPanel } from "./basemap-switcher";
import { LayerPanel } from "./layer-panel";
import { LegendPanel } from "./map-legend";
import { DownloadPanel } from "./download-panel";
import { ScaleBar } from "./controls/scale-bar";
import type maplibregl from "maplibre-gl";

interface MapControlsProps {
	map: maplibregl.Map | null;
}

export function MapControls({ map }: MapControlsProps) {
	const setControls = useMapControlsStore((s) => s.setControls);

	useEffect(() => {
		setControls([
			{
				id: "basemap",
				icon: Map,
				title: "Base Maps",
				position: "top-right",
				panel: <BasemapPanel />,
				isOpen: false,
			},
			{
				id: "overlay",
				icon: Layers,
				title: "Overlay Layers",
				position: "top-right",
				panel: <LayerPanel />,
				isOpen: false,
			},
			{
				id: "download",
				icon: Download,
				title: "Download Data",
				position: "top-right",
				panel: <DownloadPanel />,
				isOpen: false,
			},
			{
				id: "legend",
				icon: BookOpen,
				title: "Legend",
				position: "bottom-right",
				panel: <LegendPanel />,
				isOpen: false,
			},
			{
				id: "zoom-in",
				icon: Plus,
				title: "Zoom In",
				position: "bottom-left",
				isOpen: false,
				onClick: () => map?.zoomIn(),
			},
			{
				id: "zoom-out",
				icon: Minus,
				title: "Zoom Out",
				position: "bottom-left",
				isOpen: false,
				onClick: () => map?.zoomOut(),
			},
			{
				id: "scale",
				icon: () => <ScaleBar map={map} />,
				title: "Scale",
				position: "bottom-left",
				isOpen: false,
				isDisplayOnly: true,
			},
		]);
	}, [map, setControls]);

	return null;
}
