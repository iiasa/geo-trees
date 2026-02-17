import type { MapLayerDto } from "@/infrastructure/api/types.gen";
import { useMapStore } from "../stores/map-store";

interface MapLegendProps {
	layers: MapLayerDto[];
}

export function MapLegend({ layers }: MapLegendProps) {
	const { layerVisibility } = useMapStore();

	const visibleLayers = layers.filter((l) => layerVisibility[l.id!]);
	if (visibleLayers.length === 0) return null;

	return (
		<div className="absolute bottom-8 right-4 z-10 bg-gray-900/95 backdrop-blur-sm rounded-lg p-3 border border-gray-700 max-w-xs">
			<h3 className="text-xs font-semibold text-white mb-2">Legend</h3>
			{visibleLayers.map((layer) => (
				<div key={layer.id} className="mb-2 last:mb-0">
					<h4 className="text-xs text-gray-300 mb-1">{layer.name}</h4>
					{layer.legendUrl ? (
						<img
							src={layer.legendUrl}
							alt={`${layer.name} legend`}
							className="max-w-full"
						/>
					) : (
						<div className="flex items-center gap-1.5">
							<span className="w-3 h-3 rounded-full bg-green-500" />
							<span className="text-xs text-gray-400">Data points</span>
						</div>
					)}
				</div>
			))}
		</div>
	);
}
