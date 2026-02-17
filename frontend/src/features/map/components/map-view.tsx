import { useEffect, useCallback, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { MapLayerDto } from "@/infrastructure/api/types.gen";
import { useMapStore } from "../stores/map-store";
import {
	BASEMAPS,
	MAP_DEFAULTS,
	MAP_LAYER_TYPE,
	SOURCE_ENDPOINT_MAP,
} from "../constants";

interface MapViewProps {
	layers: MapLayerDto[];
	onMapReady?: (map: maplibregl.Map) => void;
}

export function MapView({ layers, onMapReady }: MapViewProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<maplibregl.Map | null>(null);
	const onMapReadyRef = useRef(onMapReady);
	onMapReadyRef.current = onMapReady;
	const { layerVisibility, layerOpacity, activeBasemap, setSelectedFeature } =
		useMapStore();
	const [mapReady, setMapReady] = useState(false);
	const popupRef = useRef<maplibregl.Popup | null>(null);
	const [styleVersion, setStyleVersion] = useState(0);

	useEffect(() => {
		const container = containerRef.current;
		if (!container || mapRef.current) return;

		const initialBasemap =
			BASEMAPS.find((b) => b.id === MAP_DEFAULTS.STYLE) ?? BASEMAPS[0];

		const map = new maplibregl.Map({
			container,
			style: initialBasemap.style,
			center: MAP_DEFAULTS.CENTER,
			zoom: MAP_DEFAULTS.ZOOM,
		});

		map.addControl(
			new maplibregl.NavigationControl({ showCompass: true }),
			"top-right",
		);
		mapRef.current = map;

		map.on("load", () => {
			setMapReady(true);
			setStyleVersion(1);
			onMapReadyRef.current?.(map);
		});

		return () => {
			map.remove();
			mapRef.current = null;
			setMapReady(false);
		};
	}, []);

	const prevBasemapRef = useRef(activeBasemap);
	useEffect(() => {
		const map = mapRef.current;
		if (!map || !mapReady) return;
		if (prevBasemapRef.current === activeBasemap) return;
		prevBasemapRef.current = activeBasemap;

		const basemap = BASEMAPS.find((b) => b.id === activeBasemap);
		if (!basemap) return;

		map.setStyle(basemap.style);
		map.once("style.load", () => {
			setStyleVersion((v) => v + 1);
		});
	}, [activeBasemap, mapReady]);

	const addLayerToMap = useCallback(
		async (map: maplibregl.Map, layer: MapLayerDto) => {
			const sourceId = `source-${layer.id}`;
			const layerId = `layer-${layer.id}`;

			if (map.getSource(sourceId)) return;

			if (layer.type === MAP_LAYER_TYPE.WMS && layer.url) {
				const tileUrl = `${layer.url}?service=WMS&request=GetMap&layers=${layer.layers || ""}&styles=&format=${layer.format || "image/png"}&transparent=true&version=1.1.1&srs=EPSG:3857&bbox={bbox-epsg-3857}&width=256&height=256`;
				map.addSource(sourceId, {
					type: "raster",
					tiles: [tileUrl],
					tileSize: 256,
					attribution: layer.attribution || "",
				});
				map.addLayer({
					id: layerId,
					type: "raster",
					source: sourceId,
					paint: { "raster-opacity": 0.7 },
				});
			} else if (
				layer.type === MAP_LAYER_TYPE.BACKEND_GEOJSON &&
				layer.sourceEndpoint
			) {
				const endpoint = SOURCE_ENDPOINT_MAP[layer.sourceEndpoint];
				if (!endpoint) return;
				try {
					const res = await fetch(endpoint);
					const geojson = await res.json();
					map.addSource(sourceId, { type: "geojson", data: geojson });
					map.addLayer({
						id: layerId,
						type: "circle",
						source: sourceId,
						paint: {
							"circle-radius": 6,
							"circle-color": "#4ade80",
							"circle-stroke-width": 1,
							"circle-stroke-color": "#166534",
						},
					});
				} catch {
					// silently fail - data may not be available
				}
			} else if (layer.type === MAP_LAYER_TYPE.EXTERNAL_GEOJSON && layer.url) {
				try {
					const res = await fetch(layer.url);
					const geojson = await res.json();
					map.addSource(sourceId, { type: "geojson", data: geojson });
					map.addLayer({
						id: layerId,
						type: "circle",
						source: sourceId,
						paint: {
							"circle-radius": 5,
							"circle-color": "#facc15",
							"circle-stroke-width": 1,
							"circle-stroke-color": "#854d0e",
						},
					});
				} catch {
					// silently fail
				}
			} else if (layer.type === MAP_LAYER_TYPE.TILE_JSON && layer.url) {
				map.addSource(sourceId, { type: "vector", url: layer.url });
				map.addLayer({
					id: layerId,
					type: "circle",
					source: sourceId,
					"source-layer": layer.layers || "default",
					paint: {
						"circle-radius": 4,
						"circle-color": "#60a5fa",
					},
				});
			}
		},
		[],
	);

	useEffect(() => {
		const map = mapRef.current;
		if (!map || styleVersion === 0) return;

		for (const layer of layers) {
			const layerId = `layer-${layer.id}`;
			const isVisible = layerVisibility[layer.id ?? ""] ?? false;

			if (isVisible) {
				if (!map.getLayer(layerId)) {
					addLayerToMap(map, layer);
				} else {
					map.setLayoutProperty(layerId, "visibility", "visible");
				}
			} else if (map.getLayer(layerId)) {
				map.setLayoutProperty(layerId, "visibility", "none");
			}
		}
	}, [layers, layerVisibility, styleVersion, addLayerToMap]);

	useEffect(() => {
		const map = mapRef.current;
		if (!map || styleVersion === 0) return;

		for (const [id, opacity] of Object.entries(layerOpacity)) {
			const layerId = `layer-${id}`;
			if (map.getLayer(layerId)) {
				const layerType = map.getLayer(layerId)?.type;
				if (layerType === "raster") {
					map.setPaintProperty(layerId, "raster-opacity", opacity / 100);
				} else if (layerType === "circle") {
					map.setPaintProperty(layerId, "circle-opacity", opacity / 100);
				}
			}
		}
	}, [layerOpacity, styleVersion]);

	useEffect(() => {
		const map = mapRef.current;
		if (!map || styleVersion === 0) return;

		const handleClick = (e: maplibregl.MapMouseEvent) => {
			const clickableLayers = layers
				.filter(
					(l) =>
						(l.type === MAP_LAYER_TYPE.BACKEND_GEOJSON ||
							l.type === MAP_LAYER_TYPE.EXTERNAL_GEOJSON) &&
						(l.id ? layerVisibility[l.id] : false),
				)
				.map((l) => `layer-${l.id}`)
				.filter((id) => map.getLayer(id));

			if (clickableLayers.length === 0) return;

			const features = map.queryRenderedFeatures(e.point, {
				layers: clickableLayers,
			});

			if (features.length > 0) {
				const feature = features[0];
				setSelectedFeature(feature as unknown as GeoJSON.Feature);

				if (popupRef.current) popupRef.current.remove();

				const properties = feature.properties || {};
				const name = properties.name || properties.PlotId || "Feature";
				const entries = Object.entries(properties)
					.filter(([key]) => key !== "name" && key !== "PlotId")
					.slice(0, 6);

				let html = `<div class="p-2 max-w-xs"><h3 class="font-semibold text-sm mb-1">${name}</h3>`;
				for (const [key, value] of entries) {
					html += `<div class="text-xs"><span class="text-gray-500">${key}:</span> ${value}</div>`;
				}
				html += "</div>";

				popupRef.current = new maplibregl.Popup({
					closeOnClick: true,
				})
					.setLngLat(e.lngLat)
					.setHTML(html)
					.addTo(map);
			}
		};

		map.on("click", handleClick);
		return () => {
			map.off("click", handleClick);
		};
	}, [layers, layerVisibility, styleVersion, setSelectedFeature]);

	return (
		<div
			ref={containerRef}
			className="absolute inset-0"
			style={{ width: "100%", height: "100%" }}
		/>
	);
}
