import { useMapStore } from "../stores/map-store";
import { useMapLayers } from "../hooks/use-map-layers";
import { useBrmData } from "../hooks/use-brm-data";
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
	const { layers } = useMapLayers();
	const { data } = useBrmData();
	const brmLayer = layers.find(
		(l) => l.sourceEndpoint === "external-data-geojson",
	);
	const brmVisible = brmLayer?.id
		? (layerVisibility[brmLayer.id] ?? false)
		: false;

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

	const entries = (Object.entries(counts) as [GeoTreesStatus, number][]).filter(
		([, count]) => count > 0,
	);

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

	const visibleLayers = layers.filter(
		(l) =>
			l.id &&
			layerVisibility[l.id] &&
			l.sourceEndpoint !== "external-data-geojson",
	);

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
