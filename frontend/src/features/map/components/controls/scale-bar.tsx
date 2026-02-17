import { useEffect, useState } from "react";
import type maplibregl from "maplibre-gl";

interface ScaleBarProps {
	map: maplibregl.Map | null;
}

function formatScale(meters: number): string {
	if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
	return `${Math.round(meters)} m`;
}

export function ScaleBar({ map }: ScaleBarProps) {
	const [scale, setScale] = useState<string | null>(null);

	useEffect(() => {
		if (!map) return;

		const updateScale = () => {
			const center = map.getCenter();
			const zoom = map.getZoom();
			const metersPerPixel =
				(156543.03392 * Math.cos((center.lat * Math.PI) / 180)) / 2 ** zoom;
			const scaleMeters = metersPerPixel * 100;
			setScale(formatScale(scaleMeters));
		};

		updateScale();
		map.on("zoomend", updateScale);
		map.on("moveend", updateScale);

		return () => {
			map.off("zoomend", updateScale);
			map.off("moveend", updateScale);
		};
	}, [map]);

	if (!scale) return null;

	return (
		<div className="flex items-center justify-center px-2.5 h-7 rounded bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
			<span className="text-[10px] font-semibold text-gray-600 whitespace-nowrap">
				{scale}
			</span>
		</div>
	);
}
