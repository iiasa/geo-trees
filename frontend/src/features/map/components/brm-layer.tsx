import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type maplibregl from "maplibre-gl";
import type { FeatureCollection, Point } from "geojson";
import { getStatusFromRaw, STATUS_COLORS } from "../utils/status-mapping";

const SOURCE_ID = "brm-sites";
const POINT_LAYER = "brm-points";

interface BrmLayerProps {
	map: maplibregl.Map | null;
	visible: boolean;
}

function processFeatures(data: FeatureCollection): FeatureCollection<Point> {
	const features = (data.features ?? [])
		.filter((f) => f.geometry?.type === "Point")
		.map((f) => ({
			...f,
			geometry: f.geometry as Point,
			properties: {
				...f.properties,
				_statusColor: getStatusFromRaw(f.properties?.Status),
			},
		}));
	return { type: "FeatureCollection", features } as FeatureCollection<Point>;
}

export function useBrmData() {
	return useQuery({
		queryKey: ["brm-sites-geojson"],
		queryFn: async () => {
			const res = await fetch(
				"/api/proxy/api/app/external-data/google-sheet-geo-json",
			);
			if (!res.ok) throw new Error(`Failed to fetch BRM data: ${res.status}`);
			const raw = (await res.json()) as FeatureCollection;
			return processFeatures(raw);
		},
		staleTime: 60 * 60 * 1000,
		gcTime: 24 * 60 * 60 * 1000,
	});
}

export function BrmLayer({ map, visible }: BrmLayerProps) {
	const { data } = useBrmData();
	const addedRef = useRef(false);

	useEffect(() => {
		if (!map || !data) return;

		const addLayers = () => {
			if (map.getSource(SOURCE_ID)) return;
			addedRef.current = true;

			map.addSource(SOURCE_ID, {
				type: "geojson",
				data,
			});

			map.addLayer({
				id: POINT_LAYER,
				type: "circle",
				source: SOURCE_ID,
				paint: {
					"circle-radius": 7,
					"circle-color": [
						"match",
						["get", "_statusColor"],
						"completed",
						STATUS_COLORS.completed,
						"ongoing",
						STATUS_COLORS.ongoing,
						"planned",
						STATUS_COLORS.planned,
						STATUS_COLORS.planned,
					],
					"circle-stroke-width": 2,
					"circle-stroke-color": "#ffffff",
				},
			});

			// Pointer cursor on points
			map.on("mouseenter", POINT_LAYER, () => {
				map.getCanvas().style.cursor = "pointer";
			});
			map.on("mouseleave", POINT_LAYER, () => {
				map.getCanvas().style.cursor = "";
			});
		};

		if (map.isStyleLoaded()) {
			addLayers();
		} else {
			map.once("style.load", addLayers);
		}

		return () => {
			if (!addedRef.current || !map.getSource(SOURCE_ID)) return;
			if (map.getLayer(POINT_LAYER)) map.removeLayer(POINT_LAYER);
			if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
			addedRef.current = false;
		};
	}, [map, data]);

	// Toggle visibility
	useEffect(() => {
		if (!map || !addedRef.current) return;
		const vis = visible ? "visible" : "none";
		if (map.getLayer(POINT_LAYER))
			map.setLayoutProperty(POINT_LAYER, "visibility", vis);
	}, [map, visible]);

	return null;
}
