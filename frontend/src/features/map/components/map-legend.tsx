import { useState } from "react";
import { X } from "lucide-react";
import type { MapLayerDto } from "@/infrastructure/api/types.gen";
import { useMapStore } from "../stores/map-store";

interface MapLegendProps {
	layers: MapLayerDto[];
}

const DEFAULT_GRADIENT = [
	{ color: "#ffffcc", label: "Low" },
	{ color: "#c2e699", label: "" },
	{ color: "#78c679", label: "" },
	{ color: "#31a354", label: "" },
	{ color: "#006837", label: "High" },
];

export function MapLegend({ layers }: MapLegendProps) {
	const { layerVisibility } = useMapStore();
	const [isVisible, setIsVisible] = useState(true);

	const visibleLayers = layers.filter((l) =>
		l.id ? layerVisibility[l.id] : false,
	);

	if (visibleLayers.length === 0 || !isVisible) return null;

	return (
		<div className="absolute bottom-8 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-lg max-w-xs">
			<div className="flex items-center justify-between mb-2">
				<h3 className="text-xs font-semibold text-gray-900">Legend</h3>
				<button
					type="button"
					onClick={() => setIsVisible(false)}
					className="text-gray-400 hover:text-gray-600 transition-colors p-0.5"
				>
					<X className="size-3.5" />
				</button>
			</div>
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
