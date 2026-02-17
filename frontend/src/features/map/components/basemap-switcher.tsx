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
