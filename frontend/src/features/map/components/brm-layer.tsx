import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type maplibregl from "maplibre-gl";
import type { FeatureCollection, Point } from "geojson";
import { getStatusFromRaw, STATUS_COLORS } from "../utils/status-mapping";

const SOURCE_ID = "brm-sites";
const CLUSTER_LAYER = "brm-clusters";
const CLUSTER_COUNT_LAYER = "brm-cluster-count";
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
				cluster: true,
				clusterMaxZoom: 14,
				clusterRadius: 60,
			});

			map.addLayer({
				id: CLUSTER_LAYER,
				type: "circle",
				source: SOURCE_ID,
				filter: ["has", "point_count"],
				paint: {
					"circle-color": [
						"step",
						["get", "point_count"],
						"#22c55e",
						10,
						"#16a34a",
						50,
						"#15803d",
					],
					"circle-radius": [
						"step",
						["get", "point_count"],
						18,
						10,
						24,
						50,
						32,
					],
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
					"text-size": 13,
					"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
				},
				paint: {
					"text-color": "#ffffff",
				},
			});

			map.addLayer({
				id: POINT_LAYER,
				type: "circle",
				source: SOURCE_ID,
				filter: ["!", ["has", "point_count"]],
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

			// Click on cluster to zoom
			map.on("click", CLUSTER_LAYER, (e) => {
				const features = map.queryRenderedFeatures(e.point, {
					layers: [CLUSTER_LAYER],
				});
				if (!features.length) return;
				const clusterId = features[0].properties?.cluster_id;
				const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource;
				source.getClusterExpansionZoom(clusterId).then((zoom) => {
					map.easeTo({
						center: (features[0].geometry as Point).coordinates as [
							number,
							number,
						],
						zoom,
					});
				});
			});

			// Pointer cursor on clusters and points
			map.on("mouseenter", CLUSTER_LAYER, () => {
				map.getCanvas().style.cursor = "pointer";
			});
			map.on("mouseleave", CLUSTER_LAYER, () => {
				map.getCanvas().style.cursor = "";
			});
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
			[CLUSTER_COUNT_LAYER, CLUSTER_LAYER, POINT_LAYER].forEach((id) => {
				if (map.getLayer(id)) map.removeLayer(id);
			});
			if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
			addedRef.current = false;
		};
	}, [map, data]);

	// Toggle visibility
	useEffect(() => {
		if (!map || !addedRef.current) return;
		const vis = visible ? "visible" : "none";
		[CLUSTER_LAYER, CLUSTER_COUNT_LAYER, POINT_LAYER].forEach((id) => {
			if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
		});
	}, [map, visible]);

	return null;
}
