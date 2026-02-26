import { useEffect } from "react";
import {
	BookOpen,
	Download,
	Globe,
	Layers,
	Map as MapIcon,
	Minus,
	Plus,
} from "lucide-react";
import { useMapControlsStore } from "../stores/map-controls-store";
import { useMapStore } from "../stores/map-store";
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
	const is3D = useMapStore((s) => s.is3D);
	const setIs3D = useMapStore((s) => s.setIs3D);

	useEffect(() => {
		setControls([
			{
				id: "basemap",
				icon: MapIcon,
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
				isOpen: true,
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
				id: "toggle-3d",
				icon: Globe,
				title: is3D ? "Switch to 2D" : "Switch to 3D Globe",
				position: "bottom-left",
				isOpen: false,
				isActive: is3D,
				onClick: () => setIs3D(!is3D),
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
	}, [map, setControls, is3D, setIs3D]);

	return null;
}
