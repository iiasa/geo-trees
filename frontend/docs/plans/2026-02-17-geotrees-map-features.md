# GeoTreesMap Feature Port Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Port all key GeoTreesMap features (clustering, status-colored markers, dynamic legend, download control, layer metadata, rich popups) from the Leaflet-based geo-wiki-v2-app into the existing maplibre-gl map.

**Architecture:** Add `supercluster` for marker clustering on maplibre's GeoJSON sources. Extend the existing Zustand store with layer opacity and metadata. Add new UI components (download panel, status legend, rich popup) as siblings to existing map controls. Status coloring uses maplibre's data-driven `circle-color` expressions keyed on feature `Status` property.

**Tech Stack:** maplibre-gl (existing), supercluster (new), Zustand (existing), TanStack Query (existing), Radix Popover (existing), lucide-react (existing)

---

## Task 1: Install supercluster and add status mapping utilities

**Files:**
- Create: `src/features/map/utils/status-mapping.ts`
- Modify: `package.json` (add `supercluster` + `@types/supercluster`)

**Step 1: Install supercluster**

Run: `pnpm add supercluster && pnpm add -D @types/supercluster`
Expected: Clean install, no peer dep warnings

**Step 2: Create status mapping utility**

Create `src/features/map/utils/status-mapping.ts` — ported from geo-wiki-v2-app's `statusMapping.ts`, adapted to our conventions:

```typescript
export type GeoTreesStatus = "completed" | "ongoing" | "planned";

const statusMap: Record<string, GeoTreesStatus | undefined> = {
	terminé: "completed",
	completed: "completed",
	completé: "completed",
	complet: "completed",
	finished: "completed",
	done: "completed",
	"en cours": "ongoing",
	ongoing: "ongoing",
	"in progress": "ongoing",
	progress: "ongoing",
	active: "ongoing",
	running: "ongoing",
	futur: "planned",
	planned: "planned",
	planifié: "planned",
	future: "planned",
	scheduled: "planned",
	proposed: "planned",
};

export const STATUS_COLORS: Record<GeoTreesStatus, string> = {
	completed: "#22c55e",
	ongoing: "#eab308",
	planned: "#6b7280",
};

export const STATUS_LABELS: Record<GeoTreesStatus, string> = {
	completed: "Completed",
	ongoing: "Ongoing",
	planned: "Planned",
};

export function getStatusFromRaw(rawStatus: string | undefined): GeoTreesStatus {
	if (!rawStatus || rawStatus.trim() === "") return "planned";
	return statusMap[rawStatus.toLowerCase()] ?? "planned";
}

export function getStatusColor(rawStatus: string | undefined): string {
	return STATUS_COLORS[getStatusFromRaw(rawStatus)];
}
```

**Step 3: Write test for status mapping**

Create `src/features/map/utils/status-mapping.test.ts`:

```typescript
import { getStatusFromRaw, getStatusColor, STATUS_COLORS } from "./status-mapping";

describe("getStatusFromRaw", () => {
	it("maps completed variations", () => {
		expect(getStatusFromRaw("completed")).toBe("completed");
		expect(getStatusFromRaw("Terminé")).toBe("completed");
		expect(getStatusFromRaw("DONE")).toBe("completed");
	});

	it("maps ongoing variations", () => {
		expect(getStatusFromRaw("ongoing")).toBe("ongoing");
		expect(getStatusFromRaw("En cours")).toBe("ongoing");
		expect(getStatusFromRaw("In Progress")).toBe("ongoing");
	});

	it("defaults to planned for unknown/empty", () => {
		expect(getStatusFromRaw(undefined)).toBe("planned");
		expect(getStatusFromRaw("")).toBe("planned");
		expect(getStatusFromRaw("unknown")).toBe("planned");
	});
});

describe("getStatusColor", () => {
	it("returns green for completed", () => {
		expect(getStatusColor("completed")).toBe(STATUS_COLORS.completed);
	});
});
```

**Step 4: Run tests**

Run: `pnpm vitest run src/features/map/utils/status-mapping.test.ts`
Expected: All pass

**Step 5: Commit**

```bash
git add src/features/map/utils/status-mapping.ts src/features/map/utils/status-mapping.test.ts package.json pnpm-lock.yaml
git commit -m "feat(map): add supercluster dependency and status mapping utilities"
```

---

## Task 2: Extend map store with opacity and layer metadata

**Files:**
- Modify: `src/features/map/stores/map-store.ts`
- Modify: `src/features/map/constants.ts`

**Step 1: Add layer opacity and metadata to store**

Edit `src/features/map/stores/map-store.ts` to add:

```typescript
import type { Feature } from "geojson";
import { create } from "zustand";
import type { BasemapId } from "../constants";
import { MAP_DEFAULTS } from "../constants";

export interface LayerMetadata {
	description?: string;
	source?: string;
	geographicCoverage?: string;
}

interface MapState {
	layerVisibility: Record<string, boolean>;
	layerOpacity: Record<string, number>;
	selectedFeature: Feature | null;
	activeBasemap: BasemapId;
	toggleLayer: (layerId: string) => void;
	setLayerVisibility: (visibility: Record<string, boolean>) => void;
	setLayerOpacity: (layerId: string, opacity: number) => void;
	setSelectedFeature: (feature: Feature | null) => void;
	setActiveBasemap: (basemap: BasemapId) => void;
}

export const useMapStore = create<MapState>((set) => ({
	layerVisibility: {},
	layerOpacity: {},
	selectedFeature: null,
	activeBasemap: MAP_DEFAULTS.STYLE as BasemapId,
	toggleLayer: (layerId) =>
		set((state) => ({
			layerVisibility: {
				...state.layerVisibility,
				[layerId]: !state.layerVisibility[layerId],
			},
		})),
	setLayerVisibility: (visibility) => set({ layerVisibility: visibility }),
	setLayerOpacity: (layerId, opacity) =>
		set((state) => ({
			layerOpacity: { ...state.layerOpacity, [layerId]: opacity },
		})),
	setSelectedFeature: (feature) => set({ selectedFeature: feature }),
	setActiveBasemap: (basemap) => set({ activeBasemap: basemap }),
}));
```

**Step 2: Run existing tests + typecheck**

Run: `pnpm typecheck`
Expected: Clean

**Step 3: Commit**

```bash
git add src/features/map/stores/map-store.ts
git commit -m "feat(map): add layer opacity to map store"
```

---

## Task 3: Create supercluster hook for maplibre

**Files:**
- Create: `src/features/map/hooks/use-supercluster.ts`

**Step 1: Create the supercluster hook**

Create `src/features/map/hooks/use-supercluster.ts`:

```typescript
import { useMemo, useCallback } from "react";
import Supercluster from "supercluster";
import type { BBox, Feature, Point, GeoJsonProperties } from "geojson";

interface UseSuperclusterOptions {
	points: Feature<Point, GeoJsonProperties>[];
	bounds: BBox | undefined;
	zoom: number;
	options?: Supercluster.Options<GeoJsonProperties, GeoJsonProperties>;
}

export function useSupercluster({
	points,
	bounds,
	zoom,
	options = {},
}: UseSuperclusterOptions) {
	const supercluster = useMemo(() => {
		const sc = new Supercluster({
			radius: 60,
			maxZoom: 16,
			...options,
		});
		sc.load(points);
		return sc;
	}, [points, options]);

	const clusters = useMemo(() => {
		if (!bounds) return [];
		return supercluster.getClusters(bounds, Math.floor(zoom));
	}, [supercluster, bounds, zoom]);

	const getExpansionZoom = useCallback(
		(clusterId: number) => {
			try {
				return supercluster.getClusterExpansionZoom(clusterId);
			} catch {
				return zoom + 2;
			}
		},
		[supercluster, zoom],
	);

	return { clusters, supercluster, getExpansionZoom };
}
```

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: Clean

**Step 3: Commit**

```bash
git add src/features/map/hooks/use-supercluster.ts
git commit -m "feat(map): add supercluster hook for maplibre clustering"
```

---

## Task 4: Create external BRM layer component with clustering

This is the core component — fetches GeoJSON from the backend's `external-data-geojson` endpoint, applies status-based coloring, and renders clustered markers using maplibre's native GeoJSON source with supercluster.

**Files:**
- Create: `src/features/map/components/brm-layer.tsx`

**Step 1: Create the BRM layer component**

Create `src/features/map/components/brm-layer.tsx`:

```typescript
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
			const res = await fetch("/api/proxy/api/app/external-data/google-sheet-geo-json");
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
						10, "#16a34a",
						50, "#15803d",
					],
					"circle-radius": [
						"step",
						["get", "point_count"],
						18,
						10, 24,
						50, 32,
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
						"completed", STATUS_COLORS.completed,
						"ongoing", STATUS_COLORS.ongoing,
						"planned", STATUS_COLORS.planned,
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
						center: (features[0].geometry as Point).coordinates as [number, number],
						zoom,
					});
				});
			});

			// Pointer cursor on clusters
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
```

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: Clean

**Step 3: Commit**

```bash
git add src/features/map/components/brm-layer.tsx
git commit -m "feat(map): add BRM sites layer with clustering and status colors"
```

---

## Task 5: Create rich popup component for BRM sites

**Files:**
- Create: `src/features/map/components/brm-popup.tsx`

**Step 1: Create the popup component**

Create `src/features/map/components/brm-popup.tsx` — ported from `GeoTreesPopup.tsx`, adapted for maplibre:

```typescript
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import type { MapGeoJSONFeature } from "maplibre-gl";
import { STATUS_LABELS, getStatusFromRaw, STATUS_COLORS } from "../utils/status-mapping";

interface BrmPopupProps {
	map: maplibregl.Map | null;
	pointLayerId: string;
}

function buildPopupHtml(feature: MapGeoJSONFeature): string {
	const props = feature.properties || {};
	const status = getStatusFromRaw(props.Status);
	const statusLabel = STATUS_LABELS[status];
	const statusColor = STATUS_COLORS[status];
	const coords =
		feature.geometry.type === "Point" ? feature.geometry.coordinates : [];
	const lat = coords[1]?.toFixed(2) ?? "";
	const lng = coords[0]?.toFixed(2) ?? "";

	const measurements = [
		props.ForestInventory === "1" ? "Forest plot inventory" : null,
		props.ALS_Measurements === "1" ? "ALS" : null,
		props.TLS_Measurements === "1" ? "TLS" : null,
	].filter(Boolean);

	const measurementHtml = measurements.length
		? measurements
				.map(
					(m) =>
						`<li style="display:flex;align-items:center;gap:6px;font-weight:600;font-size:14px;color:#111;margin-bottom:6px">
							<svg width="16" height="16" fill="none" stroke="#16a34a" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
							${m}
						</li>`,
				)
				.join("")
		: '<li style="color:#9ca3af;font-size:14px">None</li>';

	return `
		<div style="min-width:260px;max-width:320px;font-family:system-ui,sans-serif">
			<div style="display:flex;align-items:center;gap:8px;padding:12px 16px;background:#1f2937;border-radius:8px 8px 0 0">
				<span style="display:inline-block;width:12px;height:12px;transform:rotate(45deg);background:${statusColor};border:1px solid rgba(255,255,255,0.7)"></span>
				<span style="font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:${statusColor}">${statusLabel}</span>
			</div>
			<div style="padding:12px 16px 16px">
				<div style="font-style:italic;color:#6b7280;font-size:13px;margin-bottom:2px">${props.Country || ""}</div>
				<div style="font-weight:800;font-size:18px;color:#111;margin-bottom:2px">${props.Site || "BRM Site"}</div>
				<div style="font-size:11px;color:#9ca3af;margin-bottom:10px">
					LAT: <span style="color:#374151">${lat}</span> &nbsp; LNG: <span style="color:#374151">${lng}</span>
				</div>
				${props.SiteDescription ? `<div style="font-size:13px;color:#374151;line-height:1.5;margin-bottom:12px;white-space:pre-line">${props.SiteDescription}</div>` : ""}
				<hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0"/>
				<div style="font-size:13px;font-weight:600;color:#374151;margin-bottom:8px">Completed measurements:</div>
				<ul style="list-style:none;padding:0;margin:0">${measurementHtml}</ul>
			</div>
		</div>
	`;
}

export function BrmPopup({ map, pointLayerId }: BrmPopupProps) {
	const popupRef = useRef<maplibregl.Popup | null>(null);

	useEffect(() => {
		if (!map) return;

		const handleClick = (e: maplibregl.MapMouseEvent & { features?: MapGeoJSONFeature[] }) => {
			const features = map.queryRenderedFeatures(e.point, {
				layers: [pointLayerId],
			});
			if (!features.length) return;

			const feature = features[0];
			if (popupRef.current) popupRef.current.remove();

			const coords =
				feature.geometry.type === "Point"
					? (feature.geometry.coordinates.slice() as [number, number])
					: [e.lngLat.lng, e.lngLat.lat] as [number, number];

			popupRef.current = new maplibregl.Popup({
				closeOnClick: true,
				maxWidth: "360px",
			})
				.setLngLat(coords)
				.setHTML(buildPopupHtml(feature))
				.addTo(map);
		};

		map.on("click", pointLayerId, handleClick);
		return () => {
			map.off("click", pointLayerId, handleClick);
			if (popupRef.current) popupRef.current.remove();
		};
	}, [map, pointLayerId]);

	return null;
}
```

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: Clean

**Step 3: Commit**

```bash
git add src/features/map/components/brm-popup.tsx
git commit -m "feat(map): add rich BRM site popup with status display"
```

---

## Task 6: Create dynamic status legend component

**Files:**
- Create: `src/features/map/components/status-legend.tsx`

**Step 1: Create the status legend**

Create `src/features/map/components/status-legend.tsx`:

```typescript
import { useBrmData } from "./brm-layer";
import {
	getStatusFromRaw,
	STATUS_COLORS,
	STATUS_LABELS,
	type GeoTreesStatus,
} from "../utils/status-mapping";

interface StatusLegendProps {
	visible: boolean;
}

export function StatusLegend({ visible }: StatusLegendProps) {
	const { data } = useBrmData();

	if (!visible || !data) return null;

	const counts: Record<GeoTreesStatus, number> = {
		completed: 0,
		ongoing: 0,
		planned: 0,
	};
	for (const feature of data.features) {
		const status = getStatusFromRaw(feature.properties?.Status);
		counts[status]++;
	}

	const entries = (
		Object.entries(counts) as [GeoTreesStatus, number][]
	).filter(([, count]) => count > 0);

	if (entries.length === 0) return null;

	return (
		<div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-lg">
			<h4 className="text-xs font-semibold text-gray-900 mb-2">
				BRM Sites Status
			</h4>
			<div className="space-y-1.5">
				{entries.map(([status, count]) => (
					<div key={status} className="flex items-center gap-2">
						<span
							className="inline-block w-3 h-3 rounded-full shrink-0"
							style={{ backgroundColor: STATUS_COLORS[status] }}
						/>
						<span className="text-xs text-gray-700">
							{STATUS_LABELS[status]} ({count})
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
```

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: Clean

**Step 3: Commit**

```bash
git add src/features/map/components/status-legend.tsx
git commit -m "feat(map): add dynamic status legend for BRM sites"
```

---

## Task 7: Create download panel component

**Files:**
- Create: `src/features/map/components/download-panel.tsx`

**Step 1: Create the download panel**

Create `src/features/map/components/download-panel.tsx`:

```typescript
import { Download, FileJson, FileSpreadsheet } from "lucide-react";
import { useBrmData } from "./brm-layer";
import { Button } from "@/shared/components/ui/button";

export function DownloadPanel() {
	const { data } = useBrmData();

	const downloadGeoJson = () => {
		if (!data) return;
		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "geotrees-brm-sites.geojson";
		a.click();
		URL.revokeObjectURL(url);
	};

	const downloadCsv = () => {
		if (!data) return;
		const features = data.features;
		if (!features.length) return;

		const allKeys = new Set<string>();
		for (const f of features) {
			for (const key of Object.keys(f.properties || {})) {
				allKeys.add(key);
			}
		}
		const headers = ["latitude", "longitude", ...allKeys];
		const rows = features.map((f) => {
			const coords = f.geometry.type === "Point" ? f.geometry.coordinates : [];
			const props = f.properties || {};
			return [
				coords[1]?.toString() ?? "",
				coords[0]?.toString() ?? "",
				...[...allKeys].map((k) => String(props[k] ?? "")),
			];
		});

		const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(","))].join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "geotrees-brm-sites.csv";
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-lg w-56">
			<h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
				<Download className="size-4" />
				Download Data
			</h3>
			<div className="space-y-2">
				<Button
					variant="outline"
					size="sm"
					className="w-full justify-start gap-2"
					onClick={downloadGeoJson}
					disabled={!data}
				>
					<FileJson className="size-4" />
					GeoJSON
				</Button>
				<Button
					variant="outline"
					size="sm"
					className="w-full justify-start gap-2"
					onClick={downloadCsv}
					disabled={!data}
				>
					<FileSpreadsheet className="size-4" />
					CSV
				</Button>
			</div>
		</div>
	);
}
```

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: Clean

**Step 3: Commit**

```bash
git add src/features/map/components/download-panel.tsx
git commit -m "feat(map): add download panel for GeoJSON and CSV export"
```

---

## Task 8: Add layer opacity slider to layer panel

**Files:**
- Modify: `src/features/map/components/layer-panel.tsx`

**Step 1: Add opacity slider**

Edit `src/features/map/components/layer-panel.tsx` to add opacity control per layer:

Add import for `Slider` from `@/shared/components/ui/slider` and `useMapStore`'s `layerOpacity` + `setLayerOpacity`.

Add a slider beneath each layer checkbox:

```tsx
{checked && (
	<div className="pl-7 pr-1 pb-1">
		<Slider
			value={[layerOpacity[layer.id ?? ""] ?? 70]}
			onValueChange={([v]) =>
				layer.id && setLayerOpacity(layer.id, v)
			}
			min={0}
			max={100}
			step={5}
			className="w-full"
		/>
	</div>
)}
```

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: Clean

**Step 3: Commit**

```bash
git add src/features/map/components/layer-panel.tsx
git commit -m "feat(map): add per-layer opacity slider to layer panel"
```

---

## Task 9: Wire opacity into MapView

**Files:**
- Modify: `src/features/map/components/map-view.tsx`

**Step 1: Apply opacity from store to map layers**

In `map-view.tsx`, read `layerOpacity` from the store and apply it. Add a new `useEffect` that watches `layerOpacity` changes:

```typescript
const { layerVisibility, layerOpacity, activeBasemap, setSelectedFeature } = useMapStore();

// After the layer visibility effect, add:
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
```

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: Clean

**Step 3: Commit**

```bash
git add src/features/map/components/map-view.tsx
git commit -m "feat(map): wire layer opacity from store to map paint properties"
```

---

## Task 10: Integrate BRM layer, popup, legend, and download into MapPage

**Files:**
- Modify: `src/features/map/components/map-page.tsx`
- Modify: `src/features/map/components/map-view.tsx`
- Modify: `src/features/map/components/map-legend.tsx`

**Step 1: Expose map ref from MapView**

In `map-view.tsx`, accept an `onMapReady` callback prop:

```typescript
interface MapViewProps {
	layers: MapLayerDto[];
	onMapReady?: (map: maplibregl.Map) => void;
}
```

Call `onMapReady(map)` inside the `map.on("load", ...)` callback.

**Step 2: Wire BRM layer + popup into MapPage**

In `map-page.tsx`, add:

```typescript
import { useState, useEffect, useCallback } from "react";
import maplibregl from "maplibre-gl";
import { BrmLayer } from "./brm-layer";
import { BrmPopup } from "./brm-popup";
import { StatusLegend } from "./status-legend";
import { DownloadPanel } from "./download-panel";
import { Download } from "lucide-react";

// Inside MapPage:
const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
const [downloadOpen, setDownloadOpen] = useState(false);
const brmVisible = layerVisibility["brm-sites"] ?? true;

// In JSX, add after MapView:
<MapView layers={layers} onMapReady={setMapInstance} />
<BrmLayer map={mapInstance} visible={brmVisible} />
<BrmPopup map={mapInstance} pointLayerId="brm-points" />
```

**Step 3: Add BRM layer toggle to the layer panel**

In the `useEffect` that initializes layer visibility, add `"brm-sites": true` to the initial state.

**Step 4: Add download button + status legend to the map**

Add to the JSX in `map-page.tsx`:

```tsx
{/* Download button - bottom right above legend */}
<div className="absolute bottom-24 right-4 z-10">
	<button
		type="button"
		onClick={() => setDownloadOpen(!downloadOpen)}
		className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 shadow-lg p-2.5 hover:bg-gray-50 transition-colors"
	>
		<Download className="size-4 text-gray-700" />
	</button>
	{downloadOpen && (
		<div className="absolute bottom-12 right-0">
			<DownloadPanel />
		</div>
	)}
</div>

{/* Status legend */}
<div className="absolute bottom-8 right-4 z-10">
	<StatusLegend visible={brmVisible} />
</div>
```

**Step 5: Update MapLegend to not overlap**

Move `MapLegend` positioning or keep it only for non-BRM layers. The `StatusLegend` handles BRM legend separately. Adjust the positioning in `map-legend.tsx` to `bottom-8 right-48` or combine them.

**Step 6: Run typecheck + dev server**

Run: `pnpm typecheck`
Run: `pnpm dev` and verify visually
Expected: Map shows clustered BRM markers with status colors, popup on click, status legend, download panel

**Step 7: Commit**

```bash
git add src/features/map/components/map-page.tsx src/features/map/components/map-view.tsx src/features/map/components/map-legend.tsx
git commit -m "feat(map): integrate BRM layer, popup, status legend, and download panel"
```

---

## Task 11: Add ALS data layer with hardcoded positions

**Files:**
- Create: `src/features/map/constants/als-positions.ts`
- Create: `src/features/map/components/als-layer.tsx`

**Step 1: Create ALS position data**

Create `src/features/map/constants/als-positions.ts` — ported from `markerPositions.ts`:

```typescript
export const ALS_POSITIONS = [
	{ lat: -0.7641732708978066, lng: 10.546691105021557, label: "Location 1" },
	{ lat: -1.92208620034665, lng: 9.88250849758795, label: "Location 2" },
	{ lat: -0.1930312766581838, lng: 11.597241308360449, label: "Location 3" },
] as const;
```

**Step 2: Create ALS layer component**

Create `src/features/map/components/als-layer.tsx` — uses maplibre's native clustering like BRM layer:

```typescript
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
```

**Step 3: Wire into MapPage**

Add `AlsLayer` to `map-page.tsx` similar to BRM layer, with its own visibility toggle.

**Step 4: Run typecheck**

Run: `pnpm typecheck`
Expected: Clean

**Step 5: Commit**

```bash
git add src/features/map/constants/als-positions.ts src/features/map/components/als-layer.tsx src/features/map/components/map-page.tsx
git commit -m "feat(map): add ALS data layer with clustering"
```

---

## Task 12: Handle basemap style changes (re-add layers after style swap)

**Files:**
- Modify: `src/features/map/components/map-view.tsx`

**Step 1: Fix layer re-addition on basemap change**

The current `map-view.tsx` already handles `styleVersion` to re-add layers after a basemap change. The BRM and ALS layers also need to re-add. Update the `style.load` handler to increment a shared counter or emit an event the layer components can listen to.

The simplest approach: pass `styleVersion` as a prop to BRM/ALS layers, or use `map.once("style.load")` within each layer component (already done in Task 4 and 11 cleanup logic).

Actually, since BRM and ALS layers' `useEffect` already cleans up and re-runs when `map` changes, we need to ensure they also react to basemap swaps. Add `activeBasemap` from the store as a dependency in map-page so BRM/ALS re-mount:

```tsx
// In map-page.tsx, pass a key that forces remount on basemap change:
const { activeBasemap } = useMapStore();

<BrmLayer key={`brm-${activeBasemap}`} map={mapInstance} visible={brmVisible} />
<AlsLayer key={`als-${activeBasemap}`} map={mapInstance} visible={alsVisible} />
```

**Step 2: Run typecheck + manual test**

Run: `pnpm typecheck`
Test: Switch basemaps and verify layers reappear
Expected: Layers survive basemap changes

**Step 3: Commit**

```bash
git add src/features/map/components/map-page.tsx
git commit -m "fix(map): re-add BRM and ALS layers after basemap style changes"
```

---

## Task 13: Run full lint + test suite

**Step 1: Run lint**

Run: `pnpm lint`
Expected: Clean (fix any issues)

**Step 2: Run tests**

Run: `pnpm test`
Expected: All pass including new status-mapping tests

**Step 3: Run typecheck**

Run: `pnpm typecheck`
Expected: Clean

**Step 4: Final commit if any fixes**

```bash
git add -A
git commit -m "chore: lint and test fixes"
```

---

## Summary

| Task | What | New files |
|------|------|-----------|
| 1 | supercluster + status mapping | `utils/status-mapping.ts` |
| 2 | Store: opacity + metadata | (modify store) |
| 3 | Supercluster hook | `hooks/use-supercluster.ts` |
| 4 | BRM clustered layer | `components/brm-layer.tsx` |
| 5 | Rich BRM popup | `components/brm-popup.tsx` |
| 6 | Dynamic status legend | `components/status-legend.tsx` |
| 7 | Download panel | `components/download-panel.tsx` |
| 8 | Layer opacity slider | (modify layer-panel) |
| 9 | Wire opacity to map | (modify map-view) |
| 10 | Integration: wire everything | (modify map-page, map-view, map-legend) |
| 11 | ALS data layer | `constants/als-positions.ts`, `components/als-layer.tsx` |
| 12 | Basemap change resilience | (modify map-page) |
| 13 | Lint + test | — |
