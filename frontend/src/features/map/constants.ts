export const MAP_DEFAULTS = {
	CENTER: [0, 20] as [number, number],
	ZOOM: 2,
	STYLE: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
} as const;

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
