import { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import { MAP_DEFAULTS } from "../constants";

export function useMapInstance(containerId: string) {
	const mapRef = useRef<maplibregl.Map | null>(null);

	useEffect(() => {
		const container = document.getElementById(containerId);
		if (!container || mapRef.current) return;

		const map = new maplibregl.Map({
			container,
			style: MAP_DEFAULTS.STYLE,
			center: MAP_DEFAULTS.CENTER,
			zoom: MAP_DEFAULTS.ZOOM,
		});

		map.addControl(new maplibregl.NavigationControl(), "top-right");
		mapRef.current = map;

		return () => {
			map.remove();
			mapRef.current = null;
		};
	}, [containerId]);

	return mapRef;
}
