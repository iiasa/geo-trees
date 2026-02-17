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
				className="absolute -left-8 top-2 bg-gray-800/90 text-white p-1.5 rounded-l-md text-xs"
			>
				{isOpen ? ">" : "<"}
			</button>
			<div className="bg-gray-900/95 backdrop-blur-sm rounded-lg p-4 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto border border-gray-700">
				<h3 className="text-sm font-semibold text-white mb-3">
					Display Layers
				</h3>
				{Object.entries(grouped).map(([groupName, groupLayers]) => (
					<div key={groupName} className="mb-3">
						<h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
							{groupName}
						</h4>
						{groupLayers.map((layer) => (
							<label
								key={layer.id}
								className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-800/50 rounded px-1"
							>
								<input
									type="checkbox"
									checked={layerVisibility[layer.id!] ?? false}
									onChange={() => toggleLayer(layer.id!)}
									className="rounded border-gray-600"
								/>
								<span className="text-sm text-gray-200">{layer.name}</span>
							</label>
						))}
					</div>
				))}
			</div>
		</div>
	);
}
