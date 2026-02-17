import type { MapLayerDto } from "@/infrastructure/api/types.gen";
import { useMapStore } from "../stores/map-store";

interface LayerPanelProps {
	layers: MapLayerDto[];
	isOpen: boolean;
	onToggle: () => void;
}

export function LayerPanel({ layers, isOpen, onToggle }: LayerPanelProps) {
	const { layerVisibility, toggleLayer } = useMapStore();

	const grouped = layers.reduce<Record<string, MapLayerDto[]>>((acc, layer) => {
		const group = layer.groupName || "Other";
		if (!acc[group]) acc[group] = [];
		acc[group].push(layer);
		return acc;
	}, {});

	return (
		<div
			className={`absolute top-16 right-4 z-10 transition-transform duration-300 ${
				isOpen ? "translate-x-0" : "translate-x-[calc(100%+1rem)]"
			}`}
		>
			<button
				type="button"
				onClick={onToggle}
				className="absolute -left-8 top-2 bg-white/90 text-gray-700 p-1.5 rounded-l-md text-xs shadow"
			>
				{isOpen ? ">" : "<"}
			</button>
			<div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto border border-gray-200 shadow-lg">
				<h3 className="text-sm font-semibold text-gray-900 mb-3">
					Display Layers
				</h3>
				{Object.entries(grouped).map(([groupName, groupLayers]) => (
					<div key={groupName} className="mb-3">
						<h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
							{groupName}
						</h4>
						{groupLayers.map((layer) => (
							<label
								key={layer.id}
								className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-100 rounded px-1"
							>
								<input
									type="checkbox"
									checked={layerVisibility[layer.id ?? ""] ?? false}
									onChange={() => layer.id && toggleLayer(layer.id)}
									className="rounded border-gray-300"
								/>
								<span className="text-sm text-gray-700">{layer.name}</span>
							</label>
						))}
					</div>
				))}
			</div>
		</div>
	);
}
