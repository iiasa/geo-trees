# Map Control System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the ad-hoc map controls (basemap switcher, layer panel, download button, legend) with a store-driven control system using circular icon buttons with Radix Popover panels, matching the geo-wiki-v2-app architecture.

**Architecture:** A Zustand store holds a registry of map controls with positions, icons, and panel components. A `MapControlContainer` reads the store and renders controls grouped by position (top-right, bottom-right, bottom-left) as circular 44px icon buttons. Each button opens a Radix Popover panel on click. The store enforces mutual exclusivity per position (opening one closes others at the same position). Existing panel components (basemap grid, layer switcher, legend, download, status legend) are refactored into standalone panel components rendered inside popovers. A scale bar renders as a display-only control.

**Tech Stack:** Zustand (existing), Radix Popover (existing), Radix Tooltip (existing), lucide-react (existing), maplibre-gl (existing)

---

## Task 1: Create map controls store

**Files:**
- Create: `src/features/map/stores/map-controls-store.ts`
- Create: `src/features/map/stores/map-controls-store.test.ts`

**Step 1: Create the store**

Create `src/features/map/stores/map-controls-store.ts`:

```typescript
import type { ComponentType, ReactNode } from "react";
import { create } from "zustand";

export type ControlPosition =
	| "top-right"
	| "top-left"
	| "bottom-right"
	| "bottom-left";

export interface MapControl {
	id: string;
	icon: ComponentType<{ className?: string }>;
	title: string;
	position: ControlPosition;
	panel?: ReactNode;
	isOpen: boolean;
	onClick?: () => void;
	isDisplayOnly?: boolean;
}

interface MapControlsState {
	controls: MapControl[];
	setControls: (controls: MapControl[]) => void;
	toggleControl: (id: string) => void;
	closeAll: () => void;
}

export const useMapControlsStore = create<MapControlsState>((set) => ({
	controls: [],
	setControls: (controls) => set({ controls }),
	toggleControl: (id) =>
		set((state) => ({
			controls: state.controls.map((c) => {
				if (c.id === id) return { ...c, isOpen: !c.isOpen };
				// Close other controls at the same position
				const target = state.controls.find((t) => t.id === id);
				if (target && c.position === target.position && c.isOpen) {
					return { ...c, isOpen: false };
				}
				return c;
			}),
		})),
	closeAll: () =>
		set((state) => ({
			controls: state.controls.map((c) => ({ ...c, isOpen: false })),
		})),
}));
```

**Step 2: Write tests**

Create `src/features/map/stores/map-controls-store.test.ts`:

```typescript
import { useMapControlsStore } from "./map-controls-store";
import { Plus, Minus } from "lucide-react";

describe("map-controls-store", () => {
	beforeEach(() => {
		useMapControlsStore.setState({ controls: [] });
	});

	it("sets controls", () => {
		const controls = [
			{
				id: "test",
				icon: Plus,
				title: "Test",
				position: "top-right" as const,
				isOpen: false,
			},
		];
		useMapControlsStore.getState().setControls(controls);
		expect(useMapControlsStore.getState().controls).toHaveLength(1);
	});

	it("toggles control open", () => {
		useMapControlsStore.getState().setControls([
			{
				id: "a",
				icon: Plus,
				title: "A",
				position: "top-right" as const,
				isOpen: false,
			},
		]);
		useMapControlsStore.getState().toggleControl("a");
		expect(
			useMapControlsStore.getState().controls.find((c) => c.id === "a")?.isOpen,
		).toBe(true);
	});

	it("closes other controls at same position on toggle", () => {
		useMapControlsStore.getState().setControls([
			{
				id: "a",
				icon: Plus,
				title: "A",
				position: "top-right" as const,
				isOpen: true,
			},
			{
				id: "b",
				icon: Minus,
				title: "B",
				position: "top-right" as const,
				isOpen: false,
			},
		]);
		useMapControlsStore.getState().toggleControl("b");
		const controls = useMapControlsStore.getState().controls;
		expect(controls.find((c) => c.id === "a")?.isOpen).toBe(false);
		expect(controls.find((c) => c.id === "b")?.isOpen).toBe(true);
	});

	it("does not affect controls at different positions", () => {
		useMapControlsStore.getState().setControls([
			{
				id: "a",
				icon: Plus,
				title: "A",
				position: "top-right" as const,
				isOpen: true,
			},
			{
				id: "b",
				icon: Minus,
				title: "B",
				position: "bottom-left" as const,
				isOpen: false,
			},
		]);
		useMapControlsStore.getState().toggleControl("b");
		const controls = useMapControlsStore.getState().controls;
		expect(controls.find((c) => c.id === "a")?.isOpen).toBe(true);
		expect(controls.find((c) => c.id === "b")?.isOpen).toBe(true);
	});

	it("closeAll closes everything", () => {
		useMapControlsStore.getState().setControls([
			{
				id: "a",
				icon: Plus,
				title: "A",
				position: "top-right" as const,
				isOpen: true,
			},
			{
				id: "b",
				icon: Minus,
				title: "B",
				position: "bottom-left" as const,
				isOpen: true,
			},
		]);
		useMapControlsStore.getState().closeAll();
		const controls = useMapControlsStore.getState().controls;
		expect(controls.every((c) => !c.isOpen)).toBe(true);
	});
});
```

**Step 3: Run tests**

Run: `pnpm vitest run src/features/map/stores/map-controls-store.test.ts`
Expected: All pass

**Step 4: Commit**

```bash
git add src/features/map/stores/map-controls-store.ts src/features/map/stores/map-controls-store.test.ts
git commit -m "feat(map): add map controls store with mutual exclusivity"
```

---

## Task 2: Create MapControlContainer component

**Files:**
- Create: `src/features/map/components/map-control-container.tsx`

**Step 1: Create the container**

This component reads controls from the store, groups them by position, and renders each as a circular icon button. Controls with `panel` open a Radix Popover. Controls with `onClick` fire directly. Controls with `isDisplayOnly` render inline.

Create `src/features/map/components/map-control-container.tsx`:

```typescript
import { useMemo } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import {
	useMapControlsStore,
	type ControlPosition,
	type MapControl,
} from "../stores/map-controls-store";

const POSITION_CLASSES: Record<ControlPosition, string> = {
	"top-right": "top-16 right-4",
	"top-left": "top-16 left-4",
	"bottom-right": "bottom-8 right-4",
	"bottom-left": "bottom-8 left-4",
};

const POPOVER_SIDE: Record<ControlPosition, "left" | "right" | "top" | "bottom"> = {
	"top-right": "left",
	"top-left": "right",
	"bottom-right": "left",
	"bottom-left": "right",
};

function ControlButton({
	control,
	onToggle,
}: {
	control: MapControl;
	onToggle: () => void;
}) {
	const Icon = control.icon;

	if (control.isDisplayOnly) {
		return <Icon className="size-5" />;
	}

	if (control.onClick && !control.panel) {
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						type="button"
						onClick={control.onClick}
						className="flex items-center justify-center size-11 rounded-full bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg hover:bg-gray-50 transition-colors"
					>
						<Icon className="size-5 text-gray-700" />
					</button>
				</TooltipTrigger>
				<TooltipContent side={POPOVER_SIDE[control.position]}>
					{control.title}
				</TooltipContent>
			</Tooltip>
		);
	}

	if (control.panel) {
		return (
			<Popover
				open={control.isOpen}
				onOpenChange={(open) => {
					if (open !== control.isOpen) onToggle();
				}}
			>
				<Tooltip>
					<TooltipTrigger asChild>
						<PopoverTrigger asChild>
							<button
								type="button"
								className={`flex items-center justify-center size-11 rounded-full backdrop-blur-sm border shadow-lg transition-colors ${
									control.isOpen
										? "bg-primary text-white border-primary"
										: "bg-white/95 border-gray-200 hover:bg-gray-50"
								}`}
							>
								<Icon
									className={`size-5 ${control.isOpen ? "text-white" : "text-gray-700"}`}
								/>
							</button>
						</PopoverTrigger>
					</TooltipTrigger>
					<TooltipContent side={POPOVER_SIDE[control.position]}>
						{control.title}
					</TooltipContent>
				</Tooltip>
				<PopoverContent
					side={POPOVER_SIDE[control.position]}
					align={control.position.includes("bottom") ? "end" : "start"}
					sideOffset={8}
					className="w-auto p-0 border-0 bg-transparent shadow-none"
				>
					{control.panel}
				</PopoverContent>
			</Popover>
		);
	}

	return null;
}

function PositionGroup({
	position,
	controls,
}: {
	position: ControlPosition;
	controls: MapControl[];
}) {
	const toggleControl = useMapControlsStore((s) => s.toggleControl);

	return (
		<div
			className={`absolute ${POSITION_CLASSES[position]} z-10 flex flex-col gap-2`}
		>
			{controls.map((control) => (
				<ControlButton
					key={control.id}
					control={control}
					onToggle={() => toggleControl(control.id)}
				/>
			))}
		</div>
	);
}

export function MapControlContainer() {
	const controls = useMapControlsStore((s) => s.controls);

	const grouped = useMemo(() => {
		const groups: Partial<Record<ControlPosition, MapControl[]>> = {};
		for (const control of controls) {
			if (!groups[control.position]) groups[control.position] = [];
			groups[control.position]!.push(control);
		}
		return groups;
	}, [controls]);

	return (
		<>
			{(Object.entries(grouped) as [ControlPosition, MapControl[]][]).map(
				([position, posControls]) => (
					<PositionGroup
						key={position}
						position={position}
						controls={posControls}
					/>
				),
			)}
		</>
	);
}
```

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: Clean

**Step 3: Commit**

```bash
git add src/features/map/components/map-control-container.tsx
git commit -m "feat(map): add MapControlContainer with popover panels"
```

---

## Task 3: Create scale bar control

**Files:**
- Create: `src/features/map/components/controls/scale-bar.tsx`

**Step 1: Create the scale bar**

Create `src/features/map/components/controls/scale-bar.tsx`:

```typescript
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
				(156543.03392 * Math.cos((center.lat * Math.PI) / 180)) /
				2 ** zoom;
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
		<div className="flex items-center justify-center size-11 rounded-full bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
			<span className="text-[9px] font-semibold text-gray-600 leading-tight text-center">
				{scale}
			</span>
		</div>
	);
}
```

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: Clean

**Step 3: Commit**

```bash
git add src/features/map/components/controls/scale-bar.tsx
git commit -m "feat(map): add scale bar control component"
```

---

## Task 4: Refactor basemap switcher as a panel component

**Files:**
- Modify: `src/features/map/components/basemap-switcher.tsx`

**Step 1: Refactor basemap switcher**

The current `BasemapSwitcher` manages its own positioning and open/close state. Refactor it to be a pure panel component that just renders the grid of basemap thumbnails. The control container will handle positioning and open/close.

Rewrite `src/features/map/components/basemap-switcher.tsx`:

```typescript
import { BASEMAPS } from "../constants";
import { useMapStore } from "../stores/map-store";
import { useMapControlsStore } from "../stores/map-controls-store";

export function BasemapPanel() {
	const { activeBasemap, setActiveBasemap } = useMapStore();
	const closeAll = useMapControlsStore((s) => s.closeAll);

	return (
		<div className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 shadow-lg p-2 grid grid-cols-3 gap-2 w-[264px]">
			{BASEMAPS.map((basemap) => (
				<button
					key={basemap.id}
					type="button"
					onClick={() => {
						setActiveBasemap(basemap.id);
						closeAll();
					}}
					className={`flex flex-col items-center gap-1 p-1 rounded-md transition-colors ${
						basemap.id === activeBasemap
							? "ring-2 ring-primary"
							: "hover:bg-gray-100"
					}`}
				>
					<img
						src={basemap.thumbnail}
						alt={basemap.label}
						className="w-[72px] h-[72px] rounded object-cover"
					/>
					<span className="text-[10px] font-medium text-gray-700 leading-tight">
						{basemap.label}
					</span>
				</button>
			))}
		</div>
	);
}
```

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: May show errors in map-page.tsx referencing old `BasemapSwitcher` — that's fine, we'll fix it in Task 8.

**Step 3: Commit**

```bash
git add src/features/map/components/basemap-switcher.tsx
git commit -m "refactor(map): convert basemap switcher to panel component"
```

---

## Task 5: Refactor layer panel as a standalone panel component

**Files:**
- Modify: `src/features/map/components/layer-panel.tsx`

**Step 1: Refactor layer panel**

Remove the absolute positioning, slide-in animation, and toggle button. Make it a pure panel that receives layers from a hook instead of props.

Rewrite `src/features/map/components/layer-panel.tsx`:

```typescript
import type { MapLayerDto } from "@/infrastructure/api/types.gen";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Slider } from "@/shared/components/ui/slider";
import { useMapStore } from "../stores/map-store";
import { useMapLayers } from "../hooks/use-map-layers";

export function LayerPanel() {
	const { layers } = useMapLayers();
	const { layerVisibility, toggleLayer, layerOpacity, setLayerOpacity } =
		useMapStore();

	const grouped = layers.reduce<Record<string, MapLayerDto[]>>((acc, layer) => {
		const group = layer.groupName || "Other";
		if (!acc[group]) acc[group] = [];
		acc[group].push(layer);
		return acc;
	}, {});

	// Include BRM and ALS as toggleable entries
	const specialLayers = [
		{ id: "brm-sites", name: "BRM Sites", group: "GEO-TREES" },
		{ id: "als-data", name: "ALS Data", group: "GEO-TREES" },
	];

	return (
		<div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 w-64 max-h-[60vh] overflow-y-auto border border-gray-200 shadow-lg">
			<h3 className="text-sm font-semibold text-gray-900 mb-3">
				Overlay Layers
			</h3>

			{/* Special GEO-TREES layers */}
			<div className="mb-3">
				<h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
					GEO-TREES
				</h4>
				{specialLayers.map((sl) => {
					const checked = layerVisibility[sl.id] ?? false;
					const checkboxId = `layer-${sl.id}`;
					return (
						<div key={sl.id}>
							<div className="flex items-center gap-2.5 py-1.5 cursor-pointer hover:bg-gray-50 rounded px-1 transition-colors">
								<Checkbox
									id={checkboxId}
									checked={checked}
									onCheckedChange={() => toggleLayer(sl.id)}
								/>
								<label
									htmlFor={checkboxId}
									className="text-sm text-gray-700 cursor-pointer"
								>
									{sl.name}
								</label>
							</div>
							{checked && (
								<div className="pl-7 pr-1 pb-1">
									<Slider
										value={[layerOpacity[sl.id] ?? 70]}
										onValueChange={([v]) => setLayerOpacity(sl.id, v)}
										min={0}
										max={100}
										step={5}
										className="w-full"
									/>
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Backend-configured layers */}
			{Object.entries(grouped).map(([groupName, groupLayers]) => (
				<div key={groupName} className="mb-3 last:mb-0">
					<h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
						{groupName}
					</h4>
					{groupLayers.map((layer) => {
						const checked = layerVisibility[layer.id ?? ""] ?? false;
						const checkboxId = `layer-${layer.id}`;
						return (
							<div key={layer.id}>
								<div className="flex items-center gap-2.5 py-1.5 cursor-pointer hover:bg-gray-50 rounded px-1 transition-colors">
									<Checkbox
										id={checkboxId}
										checked={checked}
										onCheckedChange={() => layer.id && toggleLayer(layer.id)}
									/>
									<label
										htmlFor={checkboxId}
										className="text-sm text-gray-700 cursor-pointer"
									>
										{layer.name}
									</label>
								</div>
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
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
}
```

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: May show errors in map-page.tsx — will be fixed in Task 8.

**Step 3: Commit**

```bash
git add src/features/map/components/layer-panel.tsx
git commit -m "refactor(map): convert layer panel to standalone panel component"
```

---

## Task 6: Refactor legend into a panel component

**Files:**
- Modify: `src/features/map/components/map-legend.tsx`

**Step 1: Refactor legend**

Remove absolute positioning. Combine the existing `MapLegend` (for WMS/GeoJSON layers) and `StatusLegend` (for BRM sites) into one unified legend panel.

Rewrite `src/features/map/components/map-legend.tsx`:

```typescript
import type { MapLayerDto } from "@/infrastructure/api/types.gen";
import { useMapStore } from "../stores/map-store";
import { useMapLayers } from "../hooks/use-map-layers";
import { useBrmData } from "./brm-layer";
import {
	getStatusFromRaw,
	STATUS_COLORS,
	STATUS_LABELS,
	type GeoTreesStatus,
} from "../utils/status-mapping";

const DEFAULT_GRADIENT = [
	{ color: "#ffffcc", label: "Low" },
	{ color: "#c2e699", label: "" },
	{ color: "#78c679", label: "" },
	{ color: "#31a354", label: "" },
	{ color: "#006837", label: "High" },
];

function BrmLegendSection() {
	const { layerVisibility } = useMapStore();
	const { data } = useBrmData();
	const brmVisible = layerVisibility["brm-sites"] ?? false;

	if (!brmVisible || !data) return null;

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
		<div className="mb-3 last:mb-0">
			<h4 className="text-xs font-medium text-gray-600 mb-1.5">
				BRM Sites Status
			</h4>
			<div className="space-y-1">
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

export function LegendPanel() {
	const { layers } = useMapLayers();
	const { layerVisibility } = useMapStore();

	const visibleLayers = layers.filter((l) =>
		l.id ? layerVisibility[l.id] : false,
	);

	const hasContent = visibleLayers.length > 0 || true; // BRM section handles its own visibility

	return (
		<div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-lg max-w-xs min-w-[200px]">
			<h3 className="text-xs font-semibold text-gray-900 mb-2">Legend</h3>

			<BrmLegendSection />

			{visibleLayers.map((layer) => (
				<div key={layer.id} className="mb-3 last:mb-0">
					<h4 className="text-xs font-medium text-gray-600 mb-1.5">
						{layer.name}
					</h4>
					{layer.legendUrl ? (
						<img
							src={layer.legendUrl}
							alt={`${layer.name} legend`}
							className="max-w-full"
						/>
					) : (
						<div>
							<div className="flex h-3 rounded-sm overflow-hidden">
								{DEFAULT_GRADIENT.map((stop) => (
									<div
										key={stop.color}
										className="flex-1"
										style={{ backgroundColor: stop.color }}
									/>
								))}
							</div>
							<div className="flex justify-between mt-0.5">
								<span className="text-[10px] text-gray-500">
									{DEFAULT_GRADIENT[0].label}
								</span>
								<span className="text-[10px] text-gray-500">
									{DEFAULT_GRADIENT[DEFAULT_GRADIENT.length - 1].label}
								</span>
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	);
}
```

**Step 2: Run typecheck**

Run: `pnpm typecheck`

**Step 3: Commit**

```bash
git add src/features/map/components/map-legend.tsx
git commit -m "refactor(map): combine legend and status legend into unified panel"
```

---

## Task 7: Create the control registration component

**Files:**
- Create: `src/features/map/components/map-controls.tsx`

**Step 1: Create the control registration component**

This is the equivalent of `GeoTreesControlList` — registers all controls into the store on mount.

Create `src/features/map/components/map-controls.tsx`:

```typescript
import { useEffect } from "react";
import {
	Map,
	Layers,
	Download,
	Plus,
	Minus,
	BookOpen,
} from "lucide-react";
import { useMapControlsStore } from "../stores/map-controls-store";
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

	useEffect(() => {
		setControls([
			{
				id: "basemap",
				icon: Map,
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
				isOpen: false,
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
				id: "scale",
				icon: () => <ScaleBar map={map} />,
				title: "Scale",
				position: "bottom-left",
				isOpen: false,
				isDisplayOnly: true,
			},
		]);
	}, [map, setControls]);

	return null;
}
```

**Step 2: Run typecheck**

Run: `pnpm typecheck`

**Step 3: Commit**

```bash
git add src/features/map/components/map-controls.tsx
git commit -m "feat(map): add control registration component"
```

---

## Task 8: Rewire MapPage to use the control system

**Files:**
- Modify: `src/features/map/components/map-page.tsx`
- Delete (contents replaced): `src/features/map/components/status-legend.tsx`

**Step 1: Rewrite MapPage**

Replace all the ad-hoc control rendering with `MapControls` + `MapControlContainer`. Remove the default maplibre NavigationControl from `map-view.tsx` since we now have custom zoom buttons.

Rewrite `src/features/map/components/map-page.tsx`:

```typescript
import { useState, useEffect } from "react";
import type maplibregl from "maplibre-gl";
import { MapHeader } from "./map-header";
import { MapView } from "./map-view";
import { BrmLayer } from "./brm-layer";
import { BrmPopup } from "./brm-popup";
import { AlsLayer } from "./als-layer";
import { MapControls } from "./map-controls";
import { MapControlContainer } from "./map-control-container";
import { useMapLayers } from "../hooks/use-map-layers";
import { useMapStore } from "../stores/map-store";

export function MapPage() {
	const { layers, isLoading } = useMapLayers();
	const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
	const { setLayerVisibility, layerVisibility, activeBasemap } = useMapStore();

	const brmVisible = layerVisibility["brm-sites"] ?? true;
	const alsVisible = layerVisibility["als-data"] ?? false;

	useEffect(() => {
		if (layers.length > 0) {
			const initial: Record<string, boolean> = {
				"brm-sites": true,
				"als-data": false,
			};
			for (const layer of layers) {
				if (layer.id) {
					initial[layer.id] = layer.isVisible ?? false;
				}
			}
			setLayerVisibility(initial);
		}
	}, [layers, setLayerVisibility]);

	return (
		<div className="relative w-screen h-screen overflow-hidden">
			<MapHeader />
			{!isLoading && <MapView layers={layers} onMapReady={setMapInstance} />}
			<BrmLayer
				key={`brm-${activeBasemap}`}
				map={mapInstance}
				visible={brmVisible}
			/>
			<BrmPopup
				key={`brm-popup-${activeBasemap}`}
				map={mapInstance}
				pointLayerId="brm-points"
			/>
			<AlsLayer
				key={`als-${activeBasemap}`}
				map={mapInstance}
				visible={alsVisible}
			/>
			<MapControls map={mapInstance} />
			<MapControlContainer />
		</div>
	);
}
```

**Step 2: Remove default NavigationControl from MapView**

In `src/features/map/components/map-view.tsx`, remove these lines from the map init effect:

```typescript
map.addControl(
	new maplibregl.NavigationControl({ showCompass: true }),
	"top-right",
);
```

**Step 3: Delete status-legend.tsx**

The status legend is now integrated into `LegendPanel` (map-legend.tsx). Delete `src/features/map/components/status-legend.tsx`.

**Step 4: Run typecheck**

Run: `pnpm typecheck`
Expected: Clean. Fix any remaining import issues.

**Step 5: Run lint**

Run: `pnpm lint`
Fix any issues.

**Step 6: Run tests**

Run: `pnpm test`
Expected: All pass

**Step 7: Commit**

```bash
git add -A
git commit -m "feat(map): rewire MapPage to use store-driven control system"
```

---

## Task 9: Final verification and cleanup

**Step 1: Run full quality suite**

```bash
pnpm lint && pnpm typecheck && pnpm test
```

Expected: All clean

**Step 2: Remove any unused imports/files**

Check for orphaned files:
- `src/features/map/components/map-popup.tsx` — check if still used
- Any other unused components

**Step 3: Commit if needed**

```bash
git add -A
git commit -m "chore: cleanup unused files and imports"
```

---

## Summary

| Task | What | Key change |
|------|------|-----------|
| 1 | Controls store | Zustand store with mutual exclusivity per position |
| 2 | MapControlContainer | Renders controls as circular icon buttons with Radix Popovers |
| 3 | Scale bar | Live scale display from map zoom/center |
| 4 | Basemap panel | Refactor from self-managed to pure panel |
| 5 | Layer panel | Refactor from positioned to pure panel, add BRM/ALS toggles |
| 6 | Legend panel | Combine MapLegend + StatusLegend into unified panel |
| 7 | MapControls | Register all 7 controls into store (equivalent of GeoTreesControlList) |
| 8 | Rewire MapPage | Replace ad-hoc controls with store-driven system |
| 9 | Final verification | Lint, typecheck, test, cleanup |
