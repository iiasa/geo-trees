import { useState } from "react";
import { BASEMAPS } from "../constants";
import { useMapStore } from "../stores/map-store";

export function BasemapSwitcher() {
	const { activeBasemap, setActiveBasemap } = useMapStore();
	const [isOpen, setIsOpen] = useState(false);
	const current = BASEMAPS.find((b) => b.id === activeBasemap) ?? BASEMAPS[0];

	return (
		<div className="absolute bottom-8 left-4 z-10">
			{isOpen && (
				<div className="mb-2 bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 shadow-lg p-2 grid grid-cols-3 gap-2 w-[264px]">
					{BASEMAPS.map((basemap) => (
						<button
							key={basemap.id}
							type="button"
							onClick={() => {
								setActiveBasemap(basemap.id);
								setIsOpen(false);
							}}
							className={`flex flex-col items-center gap-1 p-1 rounded-md transition-colors ${
								basemap.id === activeBasemap
									? "ring-2 ring-teal-500"
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
			)}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 shadow-lg p-1.5 flex items-center gap-2 hover:bg-gray-50 transition-colors"
			>
				<img
					src={current.thumbnail}
					alt={current.label}
					className="w-[48px] h-[48px] rounded object-cover"
				/>
				<span className="text-xs font-medium text-gray-700 pr-1">
					{current.label}
				</span>
			</button>
		</div>
	);
}
