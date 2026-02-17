import { useEffect, useRef } from "react";
import type maplibregl from "maplibre-gl";
import type { FeatureCollection, Point } from "geojson";
import { ALS_POSITIONS } from "../constants/als-positions";

const SOURCE_ID = "als-data";
const CLUSTER_LAYER = "als-clusters";
const CLUSTER_COUNT_LAYER = "als-cluster-count";
const POINT_LAYER = "als-points";

function buildAlsGeoJson(): FeatureCollection<Point> {
	return {
		type: "FeatureCollection",
		features: ALS_POSITIONS.map((pos, i) => ({
			type: "Feature" as const,
			properties: { name: pos.label, id: i },
			geometry: {
				type: "Point" as const,
				coordinates: [pos.lng, pos.lat],
			},
		})),
	};
}

interface AlsLayerProps {
	map: maplibregl.Map | null;
	visible: boolean;
}

export function AlsLayer({ map, visible }: AlsLayerProps) {
	const addedRef = useRef(false);
	const geojson = buildAlsGeoJson();

	useEffect(() => {
		if (!map) return;

		const addLayers = () => {
			if (map.getSource(SOURCE_ID)) return;
			addedRef.current = true;

			map.addSource(SOURCE_ID, {
				type: "geojson",
				data: geojson,
				cluster: true,
				clusterMaxZoom: 14,
				clusterRadius: 50,
			});

			map.addLayer({
				id: CLUSTER_LAYER,
				type: "circle",
				source: SOURCE_ID,
				filter: ["has", "point_count"],
				paint: {
					"circle-color": "#16a34a",
					"circle-radius": 20,
					"circle-stroke-width": 3,
					"circle-stroke-color": "#ffffff",
				},
			});

			map.addLayer({
				id: CLUSTER_COUNT_LAYER,
				type: "symbol",
				source: SOURCE_ID,
				filter: ["has", "point_count"],
				layout: {
					"text-field": ["get", "point_count_abbreviated"],
					"text-size": 12,
					"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
				},
				paint: { "text-color": "#ffffff" },
			});

			map.addLayer({
				id: POINT_LAYER,
				type: "circle",
				source: SOURCE_ID,
				filter: ["!", ["has", "point_count"]],
				paint: {
					"circle-radius": 6,
					"circle-color": "#22c55e",
					"circle-stroke-width": 2,
					"circle-stroke-color": "#ffffff",
				},
			});
		};

		if (map.isStyleLoaded()) {
			addLayers();
		} else {
			map.once("style.load", addLayers);
		}

		return () => {
			if (!addedRef.current || !map.getSource(SOURCE_ID)) return;
			[CLUSTER_COUNT_LAYER, CLUSTER_LAYER, POINT_LAYER].forEach((id) => {
				if (map.getLayer(id)) map.removeLayer(id);
			});
			if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
			addedRef.current = false;
		};
	}, [map, geojson]);

	useEffect(() => {
		if (!map || !addedRef.current) return;
		const vis = visible ? "visible" : "none";
		[CLUSTER_LAYER, CLUSTER_COUNT_LAYER, POINT_LAYER].forEach((id) => {
			if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
		});
	}, [map, visible]);

	return null;
}
