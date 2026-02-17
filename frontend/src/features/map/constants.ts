export const MAP_DEFAULTS = {
	CENTER: [0, 20] as [number, number],
	ZOOM: 2,
	STYLE: "positron",
} as const;

export type BasemapId =
	| "positron"
	| "dark-matter"
	| "osm"
	| "satellite"
	| "google-roads"
	| "google-satellite";

interface BasemapDefinition {
	id: BasemapId;
	label: string;
	style: string | maplibregl.StyleSpecification;
	thumbnail: string;
}

const rasterStyle = (
	tiles: string[],
	attribution: string,
	tileSize = 256,
): maplibregl.StyleSpecification => ({
	version: 8,
	sources: {
		basemap: { type: "raster", tiles, tileSize, attribution },
	},
	layers: [{ id: "basemap", type: "raster", source: "basemap" }],
});

import type maplibregl from "maplibre-gl";

export const BASEMAPS: BasemapDefinition[] = [
	{
		id: "positron",
		label: "Light",
		style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
		thumbnail: "https://a.basemaps.cartocdn.com/light_all/3/4/3.png",
	},
	{
		id: "dark-matter",
		label: "Dark",
		style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
		thumbnail: "https://a.basemaps.cartocdn.com/dark_all/3/4/3.png",
	},
	{
		id: "osm",
		label: "Streets",
		style: rasterStyle(
			["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		),
		thumbnail: "https://tile.openstreetmap.org/3/4/3.png",
	},
	{
		id: "satellite",
		label: "Satellite",
		style: rasterStyle(
			[
				"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
			],
			"&copy; Esri",
		),
		thumbnail:
			"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/3/3/4",
	},
	{
		id: "google-roads",
		label: "Google",
		style: rasterStyle(
			["https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"],
			"&copy; Google",
		),
		thumbnail: "https://mt1.google.com/vt/lyrs=m&x=4&y=3&z=3",
	},
	{
		id: "google-satellite",
		label: "Google Sat",
		style: rasterStyle(
			["https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"],
			"&copy; Google",
		),
		thumbnail: "https://mt1.google.com/vt/lyrs=s&x=4&y=3&z=3",
	},
];

export const MAP_LAYER_TYPE = {
	WMS: 0,
	BACKEND_GEOJSON: 1,
	EXTERNAL_GEOJSON: 2,
	TILE_JSON: 3,
} as const;

export const SOURCE_ENDPOINT_MAP: Record<string, string> = {
	"plot-geojson": "/api/proxy/api/app/plot/geo-json",
	"external-data-geojson":
		"/api/proxy/api/app/external-data/google-sheet-geo-json",
} as const;
