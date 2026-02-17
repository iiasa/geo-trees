import { Layers } from "lucide-react";
import type { MapLayerDto } from "@/infrastructure/api/types.gen";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Slider } from "@/shared/components/ui/slider";
import { useMapStore } from "../stores/map-store";

interface LayerPanelProps {
	layers: MapLayerDto[];
	isOpen: boolean;
	onToggle: () => void;
}

export function LayerPanel({ layers, isOpen, onToggle }: LayerPanelProps) {
	const { layerVisibility, toggleLayer, layerOpacity, setLayerOpacity } =
		useMapStore();

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
				className="absolute -left-10 top-2 bg-white/90 text-gray-700 p-2 rounded-l-md shadow hover:bg-white transition-colors"
			>
				<Layers className="size-4" />
			</button>
			<div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto border border-gray-200 shadow-lg">
				<h3 className="text-sm font-semibold text-gray-900 mb-3">
					Display Layers
				</h3>
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
		</div>
	);
}
